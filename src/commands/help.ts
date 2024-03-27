import { embed } from "@/lib/wrappers";
import type { Command } from "@lib/types";
import { APIEmbedField, Colors, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Displays a list of all available commands."),
	displayName: "Help",
	category: "Public",
	async execute(interaction) {
		const fields: APIEmbedField[] = [];
		const categories = new Map<string, string[]>();

		interaction.client.commands.forEach((command) => {
			const result = `**/${command?.data.name}** - ${command?.data.description}`;
			const commands = categories.get(command.category);
			if (!commands) categories.set(command.category, [result]);
			else categories.set(command.category, [...commands, result]);
		});

		for (const [key, value] of categories.entries())
			fields.push({ name: `__*${key}*__`, value: value.join("\n") });

		const outputEmbed = embed("Help", Colors.Aqua, interaction);

		return await interaction.reply({ embeds: [outputEmbed.setFields(fields)] });
	},
} satisfies Command;
