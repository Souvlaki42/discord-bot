import {
  handleButtonInteractions,
  handleChatInputCommands,
} from "~/handlers/commands";
import { type Event, logger } from "~/lib/utils";

export default {
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
    else {
      const error = "This interaction is not available.";
      if (interaction.channel?.isSendable()) {
        interaction.channel.send(error);
      }
      logger.error(error);
    }
  },
} satisfies Event<"interactionCreate">;
