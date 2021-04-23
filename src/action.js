const User = require('./user');

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

class ActionPlay extends Action
{
	constructor()
	{
		super();
	}

	redo(state)
	{
		state.party = [];
		if (state.queue.length <= 0) return false;
		for (let i = 0; i < state.N; i++)
		{
			let name = state.queue.shift();
			if (typeof name === 'undefined') break;
			state.party.push(name);
		}
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
		let user = state.get_user(this.name);
		if (user.is_banned) return false;

		user.joined++;
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
		state.party.filter(x => x !== this.name);
		state.queue.filter(x => x !== this.name);
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
		let user = state.get_user(this.name);
		if (user.is_banned) return false;

		user.is_banned = true;
		state.party.filter(x => x !== this.name);
		state.queue.filter(x => x !== this.name);
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
		let user = state.get_user(this.name);
		if (!user.is_banned) return false;

		user.is_banned = false;
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
	ActionClear, ActionPlay, ActionJoin, ActionLeft,
	ActionBan, ActionUnban, ActionSetN, Action
};