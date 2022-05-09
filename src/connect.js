const fetch = require('node-fetch');
const { BrowserWindow } = require('electron');
require('./utils');

const ConnState = Enum('Inactive', 'Pending', 'Connected', 'Active');

class Connect
{
    constructor()
    {
        this.token = '';
        this.state = ConnState.Inactive;
        this.user_id = 0;
    }

    establish()                     { throw new Error('Can\'t use abstract class Connect'); }
    async init()                    { throw new Error('Can\'t use abstract class Connect'); }
    async request(endpoint, params) { throw new Error('Can\'t use abstract class Connect'); }
    async get_followers()           { throw new Error('Can\'t use abstract class Connect'); }
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
                this.state = ConnState.Connected;
            }
            else this.state = ConnState.Inactive;

            done({ cancel: false });
        });

        // Opening twitch authorization window

        const url = make_url('https://id.twitch.tv/oauth2/authorize', args);
        win_auth.once('ready-to-show', () => {
            setTimeout(() => {
                if (!win_auth.isDestroyed())
                    win_auth.show();
            }, 500);
        });
        win_auth.loadURL(url);
    }

    async init()
    {
        const result = await this.request('users');
        const users = result.data;

        if (users.length <= 0) return false;

        const user = users[0];
        this.user_id = user.id;

        return {
            'user_id'     : user.id,
            'login'       : user.login,
            'avatar'      : user.profile_image_url,
            'background'  : user.offline_image_url,
            'description' : user.description,
        };
    }

    async request(endpoint, params)
    {
        if (typeof params === 'undefined') params = {broadcaster_id: this.user_id};
        const url = make_url(`https://api.twitch.tv/helix/${endpoint}`, params);
        const opt = {headers: {'Authorization': 'Bearer ' + this.token, 'Client-Id': client_id}};

        const res = await fetch(url, opt);
        const body = await res.json();

        // console.log('---', endpoint, body);
        return body;
    }

    async get_followers()
    {
        const count = 100; // max for twitch api
        let result = [];
        let cursor = '';

        while(true)
        {
            let followers = await this.request('users/follows',
            {
                'to_id': this.user_id,
                'first': count,
                'after': cursor,
            });

            for (let follower of followers.data)
                result.push(follower.from_name);

            cursor = followers.pagination.cursor;
            if (typeof cursor === 'undefined') break;
        }
        return result;
    }
}

module.exports = { TwitchConnect, ConnState };
