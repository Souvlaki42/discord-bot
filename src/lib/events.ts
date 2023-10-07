import { customTable } from "@lib/templates";
import { Event, TableElement } from "@lib/types";
import { Client, ClientEvents, Collection, RestEvents } from "discord.js";
import { glob } from "glob";
import path from "path";

export async function loadEvents(client: Client) {
	const tableEvents: TableElement[] = [];

	if (!client.events) client.events = new Collection();
	client.events.clear();

	const files = await glob(path.join(process.cwd(), "src/events", "**/*.ts"));

	for await (const file of files) {
		try {
			let event;
			const {
				event: importedEvent,
			}: { event: Event<keyof ClientEvents | keyof RestEvents> } = await import(
				file
			);

			if (importedEvent.rest) {
				event = importedEvent as Event<keyof RestEvents>;
				if (event.once) client.rest.once(event.name, event.execute);
				else client.rest.on(event.name, event.execute);
			} else {
				event = importedEvent as Event<keyof ClientEvents>;
				if (event.once) client.once(event.name, event.execute);
				else client.on(event.name, event.execute);
			}

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

	customTable({ text: "Events", dashNumber: 16 }, tableEvents);
}

