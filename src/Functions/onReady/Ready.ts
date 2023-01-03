import Bot from '../../Bot/Bot';
import Event from '../../Structures/Event';
import {ActivityType} from 'discord.js';

function onCall(bot: Bot): void {
	console.log(`Logged in ${bot.user?.tag}`);
	bot.user?.setActivity('Made By LULU', {type: ActivityType.Playing});
}

const Ready = new Event('ready', onCall);

export default Ready;