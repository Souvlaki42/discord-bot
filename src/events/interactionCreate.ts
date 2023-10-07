import {
	handleButtonInteractions,
	handleChatInputCommands,
} from "@lib/commands";
import { Event } from "@lib/types";

export const event: Event<"interactionCreate"> = {
	name: "interactionCreate",
	displayName: "Commands",
	category: "Interactions",
	once: false,
	rest: false,
	async execute(interaction) {
		if (interaction.isChatInputCommand())
			await handleChatInputCommands(interaction);
		else if (interaction.isButton())
			await handleButtonInteractions(interaction);
		else return;
	},
};

