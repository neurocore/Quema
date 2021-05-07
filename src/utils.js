const Enum = (...v) => Object.freeze(v.reduce((o, v) => (o[v] = Symbol.for(v), o), {}));

Array.prototype.remove = val =>
{
	let i = this.indexOf(val);
	if (i >= 0) this.splice(i, 1);
	return i;
}

Array.prototype.removeIf = function(pred)
{
    let i = 0;
    while (i < this.length)
    {
        if (pred(this[i], i))
            this.splice(i, 1);
        else
            ++i;
    }
};

Array.prototype.insert = (val, i) =>
{
	if (typeof i === 'undefined') i = this.indexOf(val);
	if (i >= 0) this.splice(i, 0, val);
	return i;
}

module.exports = Enum;
