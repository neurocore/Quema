const User = require('./user');

class State
{
	constructor()
	{
		this.N = 8;
		this.users = new Map();
		this.party = [];
		this.queue = [];
		this.load();
	}

	load()
	{
		this.users.set('slaught00', new User(2, 1));
		this.users.set('sanyya', new User(1, 1, 1));
		this.users.set('d288', new User(0, 0));
	}

	set_n(val)
	{
		for (let i = 0; i < val - this.N; i++)
		{
			let name = this.queue.shift();
			if (typeof name === 'undefined') break;
			this.party.push(name);
		}

		for (let i = 0; i < this.N - val; i++)
		{
			let name = this.party.pop();
			if (typeof name === 'undefined') break;
			this.queue.unshift(name);
		}

		this.N = val;
	}

	get_user(name)
	{
		let user = this.users.get(name);
		if (typeof user === 'undefined')
		{
			this.users.set(name, new User());
			user = this.users.get(name);
		}
		return user;
	}
}

module.exports = State;
