import type { Command } from "@lib/types";
import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Responds with latencies."),
	displayName: "Ping",
	category: "Developer",
	async execute(interaction) {
		return await interaction.reply({
			content: `🏓 Latency is ${
				Date.now() - interaction.createdTimestamp
			}ms. API Latency is ${interaction.client.ws.ping}ms`,
			ephemeral: true,
		});
	},
} satisfies Command;
