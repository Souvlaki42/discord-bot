import { Event } from "@lib/types";

export const event: Event<"ready"> = {
	name: "ready",
	displayName: "Ready",
	category: "Client",
	once: true,
	rest: false,
	async execute(client) {
		client.user.setActivity(`with ${client.guilds.cache.size} guilds(s)`);
		console.log(`Logged in as ${client.user.tag}!`);
	},
};

