import fetch from 'node-fetch';
import { gapiKey } from '.';

export interface Translated
{
	data:
	{
		translations:
		{
			translatedText: string;
			detectedSourceLanguage?: string;
		}[];
	};
}

export async function translate(input: string): Promise<String>
{
	let res: Translated;
	try
	{
		res = await
		(
			await fetch
			(
				`https://translation.googleapis.com/language/translate/v2?key=${gapiKey}`,
				{
					method: 'POST',
					body: `{"q":"${
						input
							.replace(/'/gm, '\\\'')
							.replace(/"/gm, '\\"')
							.replace(/\n/gm, '\\n')
							.replace(/\t/gm, '\\t')
					}","target":"en","format":"text"}`,
					headers:
					{
						'Content-Type': 'application/json; charset=utf-8',
						'x-hal': 'I\'m afraid I can\'t let you access this header dave.'
					},
				}
			)
		).json();
	}
	catch(err)
	{
		console.log(`Google returned a translation error:\n${err}`);
		return Promise.reject(err);
	}
	return res.data.translations[0].translatedText;
}