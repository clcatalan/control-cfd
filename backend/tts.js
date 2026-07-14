const crypto = require('crypto');
const https = require('https');

// Caches in-flight promises (not just resolved buffers) so concurrent
// requests for the same text dogpile onto a single OpenAI call.
const cache = new Map();

function cacheKey(voice, text) {
  return crypto.createHash('sha256').update(`${voice}::${text}`).digest('hex');
}

// Calls the OpenAI REST API directly over https instead of going through the
// openai SDK, which requires a global `fetch` (Node 18+). This backend is
// sometimes run under an older Node (e.g. whatever `nvm`'s default happens to
// be) where `fetch` isn't defined, and the SDK's client constructor throws in
// that case — every /api/tts call failed with a 503 with no obvious cause.
// A raw https request has no Node-version dependency at all.
function doSynthesize(text, voice) {
  if (!process.env.OPENAI_API_KEY) {
    return Promise.reject(new Error('OPENAI_API_KEY not configured'));
  }

  const payload = JSON.stringify({
    model: 'tts-1',
    voice,
    input: text,
    response_format: 'mp3',
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.openai.com',
        path: '/v1/audio/speech',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks);
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`OpenAI TTS request failed: ${res.statusCode} ${body.toString('utf8').slice(0, 500)}`));
            return;
          }
          resolve(body);
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
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
