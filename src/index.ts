import { env } from "@lib/env";
import { loadEvents } from "@lib/events";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { loadCommands } from "./lib/commands";

const { GuildMember, ThreadMember, Channel, Message } = Partials;
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildPresences } =
	GatewayIntentBits;

export const client = new Client({
	intents: [
		Guilds,
		GuildMembers,
		GuildMessages,
		MessageContent,
		GuildPresences,
	],
	partials: [GuildMember, ThreadMember, Channel, Message],
});

process.on("SIGINT", () => {
	console.log("Bot's execution was terminated gracefully.");
	process.exit();
});

try {
	await client.login(env.Token);
	await loadEvents(client);
	await loadCommands(client);
} catch (error) {
	if (error instanceof Error) {
		const { name: type, message, stack } = error;
		console.error(JSON.stringify({ type, message, stack }));
	} else console.error("Unknown error occurred!");
	process.exit();
}
