import { event } from "@/lib/types";
import {
	handleButtonInteractions,
	handleChatInputCommands,
} from "@lib/commands";

export default event(
	"interactionCreate",
	"Commands",
	"Interactions",
	false,
	false,
	async (interaction) => {
		if (interaction.isChatInputCommand())
			await handleChatInputCommands(interaction);
		else if (interaction.isButton())
			await handleButtonInteractions(interaction);
		else return;
	}
);
