import fs from 'fs';
import path from 'path';
import discord from 'discord.js';
import chalk from 'chalk';
import { handleMsg } from './handlemsg';
import {_} from './stdext'; _;

interface LanguagesFile
{
	[key: string]: Language|string;
}

export interface Language extends Array<number[]|string> {};

interface Config
{
	master: string;
	translate: string[];
}

const failedToReadError = (path: string): string =>
	chalk.red`Failed to read "${path}". Either the file does not exist, or the current user does not have sufficient permission to read it.`;

// Read $(pwd)/gapi.key to a string.
export const gapiKey: string = ((): string =>
{
	try { return fs.readFileSync(path.join(process.cwd(), './gapi.key'), 'utf8'); }
	catch { console.log(failedToReadError(path.join(process.cwd(), './gapi.key'))); process.exit(); }
})();

// Read $(pwd)/discord.key to a string.
export const discordKey: string = ((): string =>
{
	try { return fs.readFileSync(path.join(process.cwd(), './discord.key'), 'utf8'); }
	catch { console.log(failedToReadError(path.join(process.cwd(), './discord.key'))); process.exit(); }
})();

// Read $(pwd)/languages.json.
export const languages: LanguagesFile = ((): LanguagesFile =>
{
	try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), './languages.json'), 'utf8')); }
	catch { console.log(failedToReadError(path.join(process.cwd(), './languages.json'))); process.exit(); }
})();

// Format languages.
// for ex:
// 	{
// 		"jp": [
//			...
//			"cjk"		
// 		],
//		"cjk": [ ... ]
// 	}
// Would copy every value from CJK into jp.
Object.keys(languages).forEach((key: string): void =>
{
	let target: Language|string = languages[key];
	if (typeof target !== 'string')
	{
		const toAdd: (number[])[] = [];
		const toRemove: number[] = [];
		target.forEach((v: number[]|string, i: number): void =>
		{
			if (typeof v === 'string')
			{
				toAdd.push(...<(number[])[]>(<Language>languages[v]))
				toRemove.push(i);
			}
		});
		toRemove.forEach((i: number): void =>
			{ (<Language>target).splice(i); });
		(<Language>target).push(...toAdd);
	}
});

// Load the emote ignore file
export const emotes: string[] = ((): string[] =>
{
	try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), './emotes.json'), 'utf8')); }
	catch { console.log(failedToReadError(path.join(process.cwd(), './emotes.json'))); process.exit(); }
})();

// Load the config file.
export const config: Config = ((): Config =>
{
	try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), './config.json'), 'utf8')); }
	catch { console.log(failedToReadError(path.join(process.cwd(), './config.json'))); process.exit(); }
})();

export let paused: boolean = false;

// Create the client.
export const client: discord.Client = new discord.Client();

client.on('ready', (): void =>
	{ console.log(`${chalk.blue`discord.js`}: Logged in as ${chalk.blue`${client.user!.tag}`}.`); });

client.on('message', async (msg: discord.Message): Promise<void> =>
{
	if (msg.content.toLowerCase().startsWith('~tl:'))
	{
		switch (msg.content.toLowerCase())
		{
			case '~tl:pause':
				if (msg.author.id === config.master)
				{
					paused = true;
					msg.channel.send('Paused.');
				}
				break;
			case '~tl:unpause':
				if (msg.author.id === config.master)
				{
					paused = false;
					msg.channel.send('Unpaused.');
				}
				break;
			default:
				msg.channel.send(`"${msg.content.toLowerCase()}" is not a recognized command.`)
				break;
		}
	}
	else
		await handleMsg(msg);
});

client.login(discordKey);