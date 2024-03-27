import {
	CacheType,
	ChatInputCommandInteraction,
	ClientEvents,
	Collection,
	InteractionResponse,
	RestEvents,
	SlashCommandBuilder,
} from "discord.js";
import "@total-typescript/ts-reset";

export * from "discord.js";
declare module "discord.js" {
	export interface Client {
		events: Collection<string, Event<any>>;
		commands: Collection<string, Command>;
	}
}

type EventCategory = "Unknown" | "Client" | "Guild" | "Interactions";
type CommandCategory = "Unknown" | "Public" | "Moderation" | "Developer";

export type Event<Event extends keyof (ClientEvents & RestEvents)> = {
	name: Event;
	displayName: string;
	category: EventCategory;
	once: boolean;
	rest: Event extends keyof RestEvents ? true : false;
	execute: (
		...args: Event extends keyof ClientEvents
			? ClientEvents[Event]
			: Event extends keyof RestEvents
			? RestEvents[Event]
			: never
	) => Promise<void>;
};

export type Command = {
	data: SlashCommandBuilder;
	displayName: string;
	category: CommandCategory;
	execute: (
		Interaction: ChatInputCommandInteraction<CacheType>
	) => Promise<InteractionResponse<boolean>>;
};

export type TableElement = {
	name?: string;
	category: EventCategory | CommandCategory;
	status: string;
};
