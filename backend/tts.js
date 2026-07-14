const crypto = require('crypto');

let client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  if (!client) {
    const OpenAI = require('openai');
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

// Caches in-flight promises (not just resolved buffers) so concurrent
// requests for the same text dogpile onto a single OpenAI call.
const cache = new Map();

function cacheKey(voice, text) {
  return crypto.createHash('sha256').update(`${voice}::${text}`).digest('hex');
}

async function doSynthesize(text, voice) {
  const openai = getClient();
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
    response_format: 'mp3',
  });
  return Buffer.from(await response.arrayBuffer());
}

async function synthesize(text, voice = 'alloy') {
  const key = cacheKey(voice, text);
  if (cache.has(key)) {
    return cache.get(key);
  }
  const promise = doSynthesize(text, voice).catch((err) => {
    cache.delete(key);
    throw err;
  });
  cache.set(key, promise);
  return promise;
}

module.exports = { synthesize };
