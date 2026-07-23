// Minimal id/title mirror of a frontend leetcodeProblems data file, derived at load
// time since the admin panel needs problem titles but not the full problem content.
//
// TEMPORARY: pointed at leetcodeProblems-new.js while the new problem set is under
// review. Change PROBLEMS_FILE back to 'leetcodeProblems.js' to revert.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROBLEMS_FILE = 'leetcodeProblems-new.js';
const PROBLEMS_PATH = path.join(__dirname, '../frontend/src/data', PROBLEMS_FILE);

function loadProblems() {
  let src = fs.readFileSync(PROBLEMS_PATH, 'utf8');
  src = src.replace(/export default (\w+)/, 'module.exports = $1');
  const sandbox = { module: { exports: {} }, exports: {}, require };
  vm.createContext(sandbox);
  new vm.Script(src, { filename: PROBLEMS_PATH }).runInContext(sandbox);
  return sandbox.module.exports.map(({ id, title }) => ({ id, title }));
}

module.exports = loadProblems();
