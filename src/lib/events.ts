import { Client, ClientEvents, Collection, RestEvents } from "discord.js";
import type { Event, TableElement } from "@lib/types";
import { table } from "@lib/wrappers";
import { glob } from "glob";
import path from "path";

const isRestEvent = (
	name: keyof ClientEvents | keyof RestEvents,
	rest: boolean
): name is keyof RestEvents => rest;

export async function loadEvents(client: Client) {
	const tableEvents: TableElement[] = [];

	if (!client.events) client.events = new Collection();
	client.events.clear();

	const files = await glob(path.join(process.cwd(), "src/events", "**/*.ts"));

	for (const file of files) {
		try {
			const { default: event }: { default: Event } = await import(file);

			if (isRestEvent(event.name, event.rest) && event.once)
				client.rest.once(event.name, event.execute);
			else if (isRestEvent(event.name, event.rest) && !event.once)
				client.rest.on(event.name, event.execute);
			else if (!isRestEvent(event.name, event.rest) && event.once)
				client.once(event.name, event.execute);
			else if (!isRestEvent(event.name, event.rest) && !event.once)
				client.on(event.name, event.execute);

			client.events.set(event.name, event);

			tableEvents.push({
				name: event.displayName,
				category: event.category,
				status: "✅",
			});
		} catch (err) {
			tableEvents.push({
				name: file.split("/").at(-1),
				category: "Unknown",
				status: "🛑",
			});
			console.error(err);
		}
	}

	table({ text: "Events", dashNumber: 16 }, tableEvents);
}
