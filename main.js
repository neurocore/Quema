const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const Quema = require('./src/quema');

const quema = new Quema();

app.whenReady().then(() =>
{
    quema.init();

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

    ipc.on('get-users', (e, arg) =>
    {
        e.reply('get-users-reply',
        {
            'party': quema.state.party,
            'queue': quema.state.queue,
            'users': Array.from(quema.state.users.entries()),
        });
    });

    ipc.on('exec-command', (e, arg) =>
    {
        quema.parse_command(arg);
        e.reply('exec-command-reply', 'done');
    });

    quema.win = win;
    console.log(quema);

    win.once('ready-to-show', () => { quema.connect(); });
});

app.on('window-all-closed', () =>
{
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () =>
{
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
