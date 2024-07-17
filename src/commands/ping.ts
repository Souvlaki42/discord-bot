import { command } from "@/lib/wrappers";
import { SlashCommandBuilder } from "discord.js";

export default command({
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Responds with latencies."),
	displayName: "Ping",
	category: "Developer",
	async execute(interaction) {
		const latency = Date.now() - interaction.createdTimestamp;
		const apiLatency = interaction.client.ws.ping;
		return await interaction.reply({
			content: `🏓 Latency is ${latency}ms. API Latency is ${apiLatency}ms`,
			ephemeral: true,
		});
	},
});
