const { app, BrowserWindow, shell, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 3000;
let mainWindow;
let nextProcess;

function waitForServer(retries = 30, delay = 1500) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http.get(`http://localhost:${PORT}`, (res) => {
        resolve();
      }).on('error', () => {
        if (retries-- > 0) {
          setTimeout(attempt, delay);
        } else {
          reject(new Error('Server did not start in time'));
        }
      });
    };
    attempt();
  });
}

function startNextServer() {
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app')
    : path.join(__dirname, '..');

  const nextScript = path.join(appPath, 'node_modules', 'next', 'dist', 'bin', 'next');

  // Use bundled node.exe next to the exe, or fall back to system node
  const bundledNode = path.join(path.dirname(process.execPath), 'node.exe');
  const systemNode = 'C:\\Program Files\\nodejs\\node.exe';

  let nodePath = 'node';
  if (app.isPackaged && fs.existsSync(bundledNode)) {
    nodePath = bundledNode;
  } else if (fs.existsSync(systemNode)) {
    nodePath = systemNode;
  }

  // Log to a file for debugging
  const logFile = path.join(app.getPath('userData'), 'server.log');
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  logStream.write(`\n--- ${new Date().toISOString()} ---\n`);
  logStream.write(`nodePath: ${nodePath}\n`);
  logStream.write(`nextScript: ${nextScript}\n`);
  logStream.write(`appPath: ${appPath}\n`);
  logStream.write(`nodeExists: ${fs.existsSync(nodePath)}\n`);
  logStream.write(`nextExists: ${fs.existsSync(nextScript)}\n`);

  nextProcess = spawn(nodePath, [nextScript, 'start', '--port', String(PORT)], {
    cwd: appPath,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(PORT),
      DATABASE_URL: `file:${path.join(appPath, 'prisma', 'dev.db')}`,
    },
    shell: false,
  });

  nextProcess.stdout.on('data', (d) => {
    const msg = d.toString().trim();
    console.log('[Next]', msg);
    logStream.write(`[stdout] ${msg}\n`);
  });
  nextProcess.stderr.on('data', (d) => {
    const msg = d.toString().trim();
    console.error('[Next]', msg);
    logStream.write(`[stderr] ${msg}\n`);
  });
  nextProcess.on('error', (err) => {
    logStream.write(`[error] ${err.message}\n`);
    dialog.showErrorBox('Server Error', `Failed to start server: ${err.message}\n\nLog: ${logFile}`);
  });
  nextProcess.on('exit', (code) => {
    logStream.write(`[exit] code=${code}\n`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'M6 GARAGE',
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  startNextServer();
  try {
    await waitForServer();
    createWindow();
  } catch (e) {
    const logFile = path.join(app.getPath('userData'), 'server.log');
    dialog.showErrorBox(
      'Startup Error',
      `Could not connect to server.\n\nCheck log file for details:\n${logFile}`
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill('SIGTERM');
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

app.on('before-quit', () => {
  if (nextProcess) nextProcess.kill('SIGTERM');
});
