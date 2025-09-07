const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const lockFile = 'pnpm-lock.yaml';
const cacheFile = '.node_modules_cache.zip';
const hashFile = '.node_modules_hash';

const crypto = require('crypto');
function getHash(file) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('hex');
}

const lockHash = getHash(lockFile);

if (fs.existsSync(cacheFile) && fs.existsSync(hashFile)) {
  const savedHash = fs.readFileSync(hashFile, 'utf8');
  if (savedHash === lockHash) {
    console.log('🔄 Extracting node_modules from cache...');
    execSync(`unzip -o ${cacheFile} -d .`, { stdio: 'inherit' });
    process.exit(0);
  }
}

console.log('📦 Installing dependencies...');
execSync('pnpm install', { stdio: 'inherit' });

console.log('📂 Zipping node_modules...');
execSync(`zip -r ${cacheFile} node_modules`, { stdio: 'inherit' });
fs.writeFileSync(hashFile, lockHash);
