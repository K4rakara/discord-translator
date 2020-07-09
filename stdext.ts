declare global
{
	interface String
	{
		chars(): Generator<string>;
	}
}

String.prototype.chars = function* (this: String): Generator<string, string>
{
	let remaining: String = this;
	while (remaining.length > 0)
	{
		let thisYield: string = remaining.substring(0, 1);
		remaining = remaining.substring(1);
		yield thisYield;
	}
	return '';
}

export const _: null = null;