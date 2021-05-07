const User = require('./user');
require('./types');

class State
{
	constructor()
	{
		this.N = 8;
        this.mode = Mode.Waiting;
		this.users = new Map();
		this.queue = [];    // users that joined to common queue
		this.party = [];    // users that are chosen to play in current session
		this.selected = []; // users that are wishing to play in current session
	}

	set_n(val)
	{
		const M = this.party.length - val; // party is changing
		for (let i = 0; i < M; i++)
		{
			const name = this.party.pop();
			this.queue.unshift(name);
		}
		this.N = val;
	}

	get_user(name)
	{
		const user = this.users.get(name);
		return typeof user === 'undefined' ? false : user;
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
		function reviver(key, value)
		{
			if (typeof value === 'object' && value !== null)
			{
				if (value.dataType === 'Map')
				{
					const Userify = x =>
					{
						return {
							0 : x[0],
							1 : Object.create(
									User.prototype,
									Object.getOwnPropertyDescriptors(x[1])
								)
						};
					}
					return new Map(value.value.map(Userify));
				}
			}
			return value;
		}
		return JSON.parse(str, reviver);
	}
}

module.exports = State;
