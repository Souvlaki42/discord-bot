import "@total-typescript/ts-reset";
import type {
	CacheType,
	ChatInputCommandInteraction,
	ClientEvents,
	Collection,
	InteractionResponse,
	RestEvents,
	SlashCommandBuilder,
} from "discord.js";

declare module "discord.js" {
	export interface Client {
		events: Collection<string, Event>;
		commands: Collection<string, Command>;
	}
}

export type EventCategory = "Unknown" | "Client" | "Guild" | "Interactions";
export type CommandCategory = "Unknown" | "Public" | "Moderation" | "Developer";

export type Event = ReturnType<typeof event>;
export const event = <E extends keyof (ClientEvents & RestEvents)>(
	name: E,
	displayName: string,
	category: EventCategory,
	once: boolean,
	rest: E extends keyof RestEvents
		? true
		: E extends keyof ClientEvents
		? false
		: never,
	execute: (
		...args: E extends keyof ClientEvents
			? ClientEvents[E]
			: E extends keyof RestEvents
			? RestEvents[E]
			: never
	) => Promise<void>
) => {
	return {
		name,
		displayName,
		category,
		once,
		rest,
		execute,
	};
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
