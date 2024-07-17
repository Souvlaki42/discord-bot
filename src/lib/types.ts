import { Collection } from "discord.js";
import { command, event } from "./wrappers";
import { z } from "zod";
import { envSchema } from "./validations";

export type EventCategory = "Unknown" | "Client" | "Guild" | "Interactions";
export type CommandCategory = "Unknown" | "Public" | "Moderation" | "Developer";

declare module "discord.js" {
	export interface Client {
		events: Collection<string, Event>;
		commands: Collection<string, Command>;
	}
}

export type Event = ReturnType<typeof event>;
export type Command = ReturnType<typeof command>;

export type TableElement = {
	name?: string;
	category: EventCategory | CommandCategory;
	status: string;
};

export type Env = z.infer<typeof envSchema>;
