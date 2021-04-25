const fs = require('fs');
const ipc = require('electron').ipcMain;
const State = require('./state');
const {
    ActionClear, ActionPlay, ActionJoin, ActionLeft,
    ActionBan, ActionUnban, ActionSetN, Action
} = require('./action');

class Quema
{
    constructor()
    {
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
                console.log(data);
                fs.writeFile('settings/state.json', data, function(err)
                {
                    console.log(err);
                });
            }
        }
    }
}

const quema = new Quema();

ipc.on('get-users', (e, arg) =>
{
    console.log(arg);
    e.reply('get-users-reply',
    {
        'party': quema.state.party,
        'queue': quema.state.queue,
    });
});

module.exports = quema;
