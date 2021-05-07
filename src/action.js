require('./utils');
require('./types');

class Action
{
	get type()  { return 'Action' };
	redo(state) { throw new Error('Can\'t use abstract class Action'); }
}

class ActionClear extends Action
{
	constructor()
	{
		super();
	}

	redo(state)
	{
		state.party = [];
		state.queue = [];
		return true;
	}
}

class ActionStart extends Action
{
	constructor(code, time_sec = 30)
	{
		super();
		this.code = code;
		this.time_sec = time_sec;
	}

	redo(state)
	{
		if (state.queue.length <= 0) return false;
		state.mode = Mode.Selecting;

		setTimeout(function()
		{
			state.mode = Mode.Waiting;
			console.log('session is complete');

			state.party = [];
			Object.assign(state.party, state.selected);
			state.selected = [];
			state.queue.removeIf(x => state.party.indexOf(x) >= 0);
		}
		, this.time_sec * 1000);

		return true;
	}
}

class ActionPlay extends Action
{
	constructor(name)
	{
		super();
		this.name = name;
	}

	redo(state)
	{
		if (state.mode !== Mode.Selecting) return false;
		if (state.queue.indexOf(this.name) < 0) return false;
		if (state.selected.indexOf(this.name) >= 0) return false;

		state.selected.push(this.name);
		return true;
	}
}

class ActionJoin extends Action
{
	constructor(name)
	{
		super();
		this.name = name;
	}

	redo(state)
	{
		const user = state.get_user(this.name);
		if (!user || user.is_banned()) return false;

		if (state.party.indexOf(this.name) >= 0) return false;
		if (state.queue.indexOf(this.name) >= 0) return false;

		user.joined_cnt++;
		state.queue.push(this.name);
		return true;
	}
}

class ActionLeft extends Action
{
	constructor(name)
	{
		super();
		this.name = name;
	}
  
	redo(state)
	{
		const name = this.name;
		state.party.removeIf(x => x === name);
		state.queue.removeIf(x => x === name);
		return true;
	}
}

class ActionBan extends Action
{
	constructor(name)
	{
		super();
		this.name = name;
	}

	redo(state)
	{
		const user = state.get_user(this.name);
		if (user.is_banned()) return false;

		user.ban_for(1);
		const name = this.name;
		state.party.removeIf(x => x === name);
		state.queue.removeIf(x => x === name);
		return true;
	}
}

class ActionUnban extends Action
{
	constructor(name)
	{
		super();
		this.name = name;
	}

	redo(state)
	{
		const user = state.get_user(this.name);
		if (!user.is_banned()) return false;

		user.unban();
		return true;
	}
}

class ActionSetN extends Action
{
	constructor(val)
	{
		super();
		this.val = val;
	}

	redo(state)
	{
		state.set_n(this.val);
		return true;
	}
}

module.exports =
{
	ActionClear, ActionStart, ActionPlay, ActionSetN,
	ActionJoin, ActionLeft, ActionBan, ActionUnban, Action
};
