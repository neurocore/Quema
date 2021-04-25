const User = require('./user');

class State
{
	constructor()
	{
		this.N = 8;
		this.users = new Map();
		this.party = [];
		this.queue = [];
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

	encode()
	{
		function replacer(key, value)
		{
			if (value instanceof Map)
			{
				return {
					dataType: 'Map',
					value: Array.from(value.entries()),
				};
			}
			else return value;
		}
		return JSON.stringify(this, replacer);
	}

	decode(str)
	{
		console.log(str);
		function reviver(key, value)
		{
			if (typeof value === 'object' && value !== null)
			{
				if (value.dataType === 'Map')
					return new Map(value.value);
			}
			return value;
		}
		return JSON.parse(str, reviver);
	}
}

module.exports = State;
