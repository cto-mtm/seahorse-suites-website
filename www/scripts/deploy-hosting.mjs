import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wwwDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(wwwDir, '..');
const distDir = path.resolve(wwwDir, '.output', 'public');
const firebaseDir = path.resolve(rootDir, 'firebase');
const firebaseWwwDir = path.resolve(firebaseDir, 'www');

console.log('🚀 Step 1/3: Generating static Nuxt output...');
execSync('npm run generate', { cwd: wwwDir, stdio: 'inherit' });

console.log('📦 Step 2/3: Syncing build output to firebase/www...');
if (fs.existsSync(firebaseWwwDir)) {
  fs.rmSync(firebaseWwwDir, { recursive: true, force: true });
}
fs.mkdirSync(firebaseWwwDir, { recursive: true });
fs.cpSync(distDir, firebaseWwwDir, { recursive: true });

console.log('🔥 Step 3/3: Deploying to Firebase Hosting...');
execSync('npx firebase deploy --only hosting --project seahorse-suites-website', { cwd: firebaseDir, stdio: 'inherit' });

console.log('✅ Firebase Hosting deployment complete!');
