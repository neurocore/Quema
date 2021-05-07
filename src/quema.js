const fs = require('fs');
const State = require('./state');
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
        this.load();
    }

    load()
    {
        const data = fs.readFileSync('settings/state.json', 'utf-8', err =>
        {
            console.log(err);
            throw err;
        });
        this.state = this.state.decode(data);
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
