import "@total-typescript/ts-reset";
import {
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
export const event = <N extends keyof (ClientEvents & RestEvents)>({
	name,
	displayName,
	category,
	once = false,
	rest,
	execute,
}: {
	name: N;
	displayName?: string;
	category: EventCategory;
	once?: boolean;
	rest?: N extends keyof RestEvents ? true : false;
	execute: (
		...args: N extends keyof RestEvents
			? RestEvents[N]
			: N extends keyof ClientEvents
			? ClientEvents[N]
			: never
	) => Promise<void>;
}) => {
	return {
		name,
		displayName,
		category,
		once,
		rest,
		execute,
	};
};

export type Command = ReturnType<typeof command>;
export const command = ({
	builder,
	displayName,
	category,
	execute,
}: {
	builder: SlashCommandBuilder;
	displayName?: string;
	category: CommandCategory;
	execute: (
		interaction: ChatInputCommandInteraction<CacheType>
	) => Promise<InteractionResponse<boolean>>;
}) => {
	return {
		builder,
		displayName,
		category,
		execute,
	};
};

export type TableElement = {
	name?: string;
	category: EventCategory | CommandCategory;
	status: string;
};
