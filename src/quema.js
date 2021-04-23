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
        this.actions.push(new ActionClear());
        this.actions.push(new ActionSetN(2));
        this.actions.push(new ActionJoin('slaught00'));
        this.actions.push(new ActionJoin('d288'));
        this.actions.push(new ActionJoin('dmytr'));
        this.actions.push(new ActionJoin('Agony'));
        this.actions.push(new ActionBan('dmytr'));
        this.actions.push(new ActionPlay());

        for (let action of this.actions)
        {
            this.memento.push(this.state);
            if (!action.redo(this.state))
                this.memento.pop();
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
