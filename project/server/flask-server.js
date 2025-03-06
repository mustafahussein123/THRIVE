import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Flask server...');

// Run the Python app directly
const pythonProcess = spawn('python3', [path.join(__dirname, '../app.py')]);

pythonProcess.stdout.on('data', (data) => {
  console.log(`Flask stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Flask stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Flask server process exited with code ${code}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Stopping Flask server...');
  pythonProcess.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Stopping Flask server...');
  pythonProcess.kill('SIGTERM');
  process.exit();
});