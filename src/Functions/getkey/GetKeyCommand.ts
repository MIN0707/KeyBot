import SlashCommand from '../../Structures/SlashCommand';
import {EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import {OWNERID} from '../../Config/Config';
import Mongo, {Ikey} from "../../../Mongo";

const slashCommandBuilder = new SlashCommandBuilder()
	.setName('get_key')
	.setDescription('It can receive a key for execution or entry')

function GetRandom(): string {
	return Math.random().toString(36).substring(2, 11);
}

const GetKeyCommand = new SlashCommand(slashCommandBuilder, async (bot, interaction) => {
	let key = '';
	while(true) {
		const random = GetRandom();
		const keyData = await Mongo.findOne({key: random});
		if(!keyData) {
			key = random;
			break;
		}
	}
	const issuer = interaction.user?.tag;
	const owner = await interaction.guild?.members.cache.get(OWNERID);
	const curr = new Date();

	const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
	const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
	const kr_curr = new Date(utc + (KR_TIME_DIFF));

	const information: Ikey = {key: key, issuer: issuer, date: kr_curr.getTime()};

	const keyEmbed = new EmbedBuilder()
		.setTitle('Here are your key')
		.setDescription('Use this key to execute or enter\nThis key is only valid for 1 minute\nThis log will send to the owner')
		.addFields(
			{name: 'Key', value: key, inline: true},
			{name: 'Issuer', value: issuer, inline: true},
			{name: 'Date', value: kr_curr.toTimeString(), inline: false},
		)
		.setColor('#fff217')

	const logEmbed = new EmbedBuilder()
		.setTitle(issuer + ' has requested a key')
		.setDescription('key : ' + key)
		.setColor('#fff217')
	await Mongo.create(information);
	await interaction.reply({embeds: [keyEmbed], ephemeral: true}).then(()=>{
		setTimeout(()=>{
			Mongo.deleteOne({key: key});
			interaction.editReply({embeds: [
				keyEmbed
					.setDescription('This key is no longer valid')
					.setFields([])
				]})
		}, 1000 * 60);
	});
	await owner?.send({embeds: [logEmbed]});
});

export default GetKeyCommand;
