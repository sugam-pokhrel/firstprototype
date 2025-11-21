const { spawn } = require('child_process');
const path = require('path');

console.log('Starting WashGo backend server...');

const serverProcess = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

serverProcess.on('error', (error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

