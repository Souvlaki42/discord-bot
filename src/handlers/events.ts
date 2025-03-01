import {
  Client,
  type ClientEvents,
  Collection,
  type RestEvents,
} from "discord.js";
import { type Event, type EventName, logger, Table } from "~/lib/utils";

const isRestEvent = (_: EventName, rest: boolean): _ is keyof RestEvents =>
  rest;

const isClientEvent = (_: EventName, rest: boolean): _ is keyof ClientEvents =>
  rest;

export async function loadEvents(client: Client) {
  const eventTable = new Table("Events", 16);

  if (!client.events) client.events = new Collection();
  client.events.clear();

  const glob = new Bun.Glob("**/*.ts");

  for await (const file of glob.scan({ cwd: "./src/events", absolute: true })) {
    try {
      const { default: event }: { default: Event<EventName> } = await import(
        file
      );
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

      eventTable.push({
        name: event.displayName ?? file.split("/").at(-1),
        category: event.category,
        status: "✅",
      });
    } catch (err) {
      eventTable.push({
        name: file.split("/").at(-1),
        category: "Unknown",
        status: "🛑",
      });
      logger.error(err);
    }
  }

  eventTable.print();
}
