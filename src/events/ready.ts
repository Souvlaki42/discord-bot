import { event } from "@/lib/types";

export default event(
	"ready",
	"Ready",
	"Client",
	true,
	false,
	async (client) => {
		client.user.setActivity(`with ${client.guilds.cache.size} guilds(s)`);
		console.log(`Logged in as ${client.user.tag}!`);
	}
);
