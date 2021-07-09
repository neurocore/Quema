const fs = require('fs');
const State = require('./state');
const { TwitchConnect, ConnState } = require('./connect');
const {
    ActionClear, ActionStart, ActionPlay, ActionSetN,
    ActionJoin, ActionLeft, ActionBan, ActionUnban, Action
} = require('./action');

class Quema
{
    constructor()
    {
        this.win = undefined;
        this.actions = [];
        this.memento = [];
        this.state = new State();
        this.conn = new TwitchConnect();
    }

    init()
    {
        this.load();
    }

    load()
    {
        const data = fs.readFileSync('settings/state.json', 'utf-8', err =>
        {
            console.log(err);
            throw err;
        });
        Object.assign(this.state, this.state.decode(data));
    }

    connect()
    {
        this.conn.state = ConnState.Pending;
        this.render_conn();

        this.conn.establish();
        
        const timer = setInterval(() =>
        {
            if (this.conn.token.length > 0
            &&  this.win != undefined)
            {
                this.render_conn();
                clearInterval(timer);
            }
        }, 200);
    }

    execute_actions()
    {
        for (let action of this.actions)
        {
            this.memento.push(this.state);
            if (!action.redo(this.state))
                this.memento.pop();
            else
            {
                const data = this.state.encode();
                fs.writeFile('settings/state.json', data, function(err)
                {
                    console.log(err);
                });
            }
        }
        this.actions = [];
        this.render();
    }

    undo()
    {
        this.state = this.memento.pop();
        console.log('undo', this);
        this.render();
    }

    render()
    {
        this.win.webContents.send('get-users-reply',
        {
            'party': this.state.party,
            'queue': this.state.queue,
            'users': Array.from(this.state.users.entries()),
        });
    }

    render_conn()
    {
        this.win.webContents.send('get-connections',
        {
            'type'   : this.conn.type.toLowerCase(),
            'active' : this.conn.state == ConnState.Active,
            'pending': this.conn.state == ConnState.Pending,
        });
    }

    parse_command(str)
    {
        const roadmap =
        {
            'join'  : (name)       => new ActionJoin(name),
            'left'  : (name)       => new ActionLeft(name),
            'ban'   : (name, time) => new ActionBan(name, time),
            'unban' : (name)       => new ActionUnban(name),
            'start' : (code, time) => new ActionStart(code, time),
            'play'  : (name)       => new ActionPlay(name),
            'clear' : ()           => new ActionClear(),

            'undo'  : function() { return this.undo; },
        }

        console.log('parse_command', str);

        const words = str.split(' ');
        const args = words.length;
        if (args < 1) return;
        const cmd = words.shift();

        if (roadmap.hasOwnProperty(cmd))
        {
            const result = roadmap[cmd](...words);
            if (result instanceof Action)
            {
                this.actions.push(result);
                this.execute_actions();
            }
            else if (typeof result === 'function')
            {
                result.bind(this).call();
            }
        }
    }
}

module.exports = Quema;
