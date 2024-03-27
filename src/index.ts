import { env } from "@lib/env";
import { loadEvents } from "@lib/events";
import {
	Client,
	GatewayIntentBits,
	Partials,
	type ClientOptions,
} from "discord.js";
import { loadCommands } from "./lib/commands";

const clientOptions = {
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
} satisfies ClientOptions;

export const client = new Client(clientOptions);

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
