import { env } from "@/lib/validations";
import { loadEvents } from "@lib/events";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { loadCommands } from "@lib/commands";
import { logger } from "@lib/wrappers";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
	partials: [
		Partials.GuildMember,
		Partials.ThreadMember,
		Partials.Channel,
		Partials.Message,
	],
});

process.on("SIGINT", () => {
	logger.info("Bot's execution was terminated gracefully.");
	process.exit(0);
});

try {
	await client.login(env.Token);
	await loadEvents(client);
	await loadCommands(client);
} catch (error) {
	logger.error(error);
	process.exit(1);
}
