import {
  handleButtonInteractions,
  handleChatInputCommands,
} from "~/handlers/commands";
import { logger } from "~/lib/logger";
import type { Event } from "~/lib/utils";

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
      if (interaction.channel?.isSendable()) {
        interaction.channel.send("This interaction is not available.");
      }
      logger.error("Interaction unavailable", {
        action: "interaction",
        context: interaction.context,
      });
    }
  },
} satisfies Event<"interactionCreate">;
