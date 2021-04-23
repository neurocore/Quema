const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const quema = require('./src/quema');

console.log(quema);

function createWindow()
{
  const win = new BrowserWindow(
  {
    width: 800, height: 800, frame: false, 
    webPreferences: {nodeIntegration: true}
  });
  win.loadFile('index.html');

  ipc.on('control-click', (e, arg) =>
  {
    console.log(arg);
    switch(arg)
    {
      case 'minimize': win.minimize(); break;
      case 'maximize': win.isMaximized() ? win.unmaximize() : win.maximize(); break;
      case 'close': win.close(); break;
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () =>
{
  if (process.platform !== 'darwin') app.quit();
})

app.on('activate', () =>
{
  if (BrowserWindow.getAllWindows().length === 0)
    createWindow();
})