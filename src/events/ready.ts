import { event } from "@/lib/wrappers";

export default event({
	name: "ready",
	displayName: "Ready",
	category: "Client",
	once: true,
	rest: false,
	execute: async (client) => {
		client.user.setActivity(`with ${client.guilds.cache.size} guilds(s)`);
		console.log(`Logged in as ${client.user.tag}!`);
	},
});
