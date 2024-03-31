import { event } from "@/lib/types";
import {
	handleButtonInteractions,
	handleChatInputCommands,
} from "@lib/commands";

export default event({
	name: "interactionCreate",
	displayName: "Commands",
	category: "Interactions",
	once: false,
	rest: false,
	execute: async (interaction) => {
		if (interaction.isChatInputCommand())
			await handleChatInputCommands(interaction);
		else if (interaction.isButton())
			await handleButtonInteractions(interaction);
		else return;
	},
});
