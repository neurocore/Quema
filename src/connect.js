const { BrowserWindow } = require('electron');
require('./utils');

const ConnState = Enum('Inactive', 'Pending', 'Active');

class Connect
{
    constructor()
    {
        this.token = '';
        this.state = ConnState.Inactive;
    }

    establish()
    {
        throw new Error('Can\'t use abstract class Connect');
    }
}

class TwitchConnect extends Connect
{
    constructor()
    {
        super();
        this.type = 'Twitch';
    }

    establish()
    {
        this.state = ConnState.Pending;

        const win_auth = new BrowserWindow(
        {
            width: 600, height: 450, frame: true, show: false, modal: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: './preload.js'
            }
        });

        const args =
        {
            client_id: client_id,
            redirect_uri: 'http://localhost',
            scope: 'viewing_activity_read',
            state: 'c3ab8aa609ea11e793ae92361f002671',
            response_type: 'token'
        }

        // Catching twitch auth redirect and collecting all data in GET

        win_auth.webContents.session.webRequest
            .onBeforeRequest({ urls: [args.redirect_uri + '/'] }, (data, done) =>
        {
            win_auth.destroy();
            const uri = data.url.replace(args.redirect_uri + '/#', '');
            const params = Object.fromEntries(uri.split('&').map(x => x.split('=')));
            console.log('TwitchConnect params:', params);

            if (params.error)
                reject(new Error(`Error received from Twitch: ${params.error}`));

            if (params.state === args.state && params.access_token)
            {
                this.token = params.access_token;
                this.state = ConnState.Active;
            }
            else this.state = ConnState.Inactive;

            done({ cancel: false });
        });

        // Opening twitch authorization window
        const url = make_url('https://id.twitch.tv/oauth2/authorize', args);
        win_auth.once('ready-to-show', () => { win_auth.show() })
        win_auth.loadURL(url);
    }
}

module.exports = { TwitchConnect, ConnState };
