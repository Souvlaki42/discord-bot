import {
  ChatInputCommandInteraction,
  type ClientEvents,
  Collection,
  InteractionResponse,
  type RestEvents,
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";

declare module "discord.js" {
  export interface Client {
    events: Collection<string, Event<EventName>>;
    commands: Collection<string, Command>;
  }
}

export type EventName = keyof ClientEvents | keyof RestEvents;
export type Event<N extends EventName> = {
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
};

export type Command = {
  builder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  displayName?: string;
  category: CommandCategory;
  execute: (
    interaction: ChatInputCommandInteraction
  ) => Promise<InteractionResponse<boolean>>;
};

export type EventCategory = "Unknown" | "Client" | "Guild" | "Interactions";
export type CommandCategory = "Unknown" | "Public" | "Moderation" | "Developer";

export type TableElement = {
  name?: string;
  category: EventCategory | CommandCategory;
  status: string;
};
