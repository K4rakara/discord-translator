import discord from 'discord.js';
import chalk from 'chalk';
import { translate } from './translate';
import { client, paused, emotes, config, languages, Language } from '.';

export const handleMsg = async (msg: discord.Message): Promise<void> =>
{
	if (msg.author.id !== client.user!.id)
	{
		let content: string = msg.content;
		
		// Remove emotes with japanese characters.
		emotes.forEach((emote: string): void =>
			{ content = content.replace(new RegExp(`${emote}`, 'gm'), ''); });
		
		// Check if the message has any characters that match the specified languages to translate.
		let doTranslate: boolean = false;
		const chars: Generator<string, string> = content.chars();
		let thisChar = chars.next();
		while (!thisChar.done)
		{
			config.translate.forEach((lang: string): void =>
			{
				if (languages[lang] != null)
				{
					const charCode: number = thisChar.value.charCodeAt(0);
					(<(number[])[]>(<Language>languages[lang])).forEach((v: number[]): void =>
					{
						if (v[0] <= charCode && v[1] >= charCode) doTranslate = true;
					});
				}
			});
			thisChar = chars.next();
		}

		if (doTranslate)
		{
			if (!paused)
			{
				const master = await client.users.fetch(`${config.master}`);
	
				let dms: discord.DMChannel;
				if (!(master.dmChannel != null))
					dms = await master.createDM();
				else
					dms = master.dmChannel;

				const translated = await translate(msg.content);

				console.log(`${
					chalk.blue`translation`
				}: Translated ${
					chalk.green`"${
						msg.content
							.replace(/"/gm, '\\"')
							.replace(/'/gm, '\\\'')
							.replace(/\n/gm, '\\n')
							.replace(/\t/gm, '\\t')
					}"`
				} to ${
					chalk.green`"${
						translated
							.replace(/"/gm, '\\"')
							.replace(/'/gm, '\\\'')
							.replace(/\n/gm, '\\n')
							.replace(/\t/gm, '\\t')
					}"`
				}`)
				
				dms.send(`${
						msg.author.tag
					} sent the following message:\n${
						msg.content
					}\nTranslated into english, it means:\n${
						translated
					}`);
			}
		}
	}
};