import { Client, ClientEvents, Collection, RestEvents } from "discord.js";
import type { Event, TableElement } from "@lib/types";
import { logger, table } from "@lib/wrappers";

const isRestEvent = (
	_: keyof ClientEvents | keyof RestEvents,
	rest: boolean
): _ is keyof RestEvents => rest;

const isClientEvent = (
	_: keyof ClientEvents | keyof RestEvents,
	rest: boolean
): _ is keyof ClientEvents => rest;

export async function loadEvents(client: Client) {
	const tableEvents: TableElement[] = [];

	if (!client.events) client.events = new Collection();
	client.events.clear();

	const glob = new Bun.Glob("**/*.ts");

	for await (const file of glob.scan({ cwd: "./src/events", absolute: true })) {
		try {
			const { default: event }: { default: Event } = await import(file);
			const rest = event.rest ?? false;

			if (isRestEvent(event.name, rest) && event.once)
				client.rest.once(event.name, event.execute);
			else if (isRestEvent(event.name, rest) && !event.once)
				client.rest.on(event.name, event.execute);
			else if (isClientEvent(event.name, rest) && event.once)
				client.once(event.name, event.execute);
			else if (isClientEvent(event.name, rest) && !event.once)
				client.on(event.name, event.execute);

			client.events.set(event.name, event);

			tableEvents.push({
				name: event.displayName ?? file.split("/").at(-1),
				category: event.category,
				status: "✅",
			});
		} catch (err) {
			tableEvents.push({
				name: file.split("/").at(-1),
				category: "Unknown",
				status: "🛑",
			});
			logger.error(err);
		}
	}

	table(tableEvents, "Events", 16);
}
