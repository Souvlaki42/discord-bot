import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  Collection,
} from "discord.js";
import { logger } from "~/lib/logger";
import { Table } from "~/lib/table";
import type { Command } from "~/lib/utils";

export async function loadCommands(client: Client) {
  const commandsTable = new Table("Commands", 15);

  if (!client.commands) client.commands = new Collection();
  client.commands.clear();

  if (!client.application) return;
  client.application.commands.cache.clear();

  const glob = new Bun.Glob("**/*.ts");

  for await (const file of glob.scan({
    cwd: "./src/commands",
    absolute: true,
  })) {
    try {
      const { default: command }: { default: Command } = await import(file);

      client.commands.set(command.builder.name, command);

      commandsTable.push({
        name: command.displayName,
        category: command.category,
        status: "✅",
      });
    } catch {
      commandsTable.push({
        name: file.split("/").at(-1),
        category: "Unknown",
        status: "🛑",
      });
    }
  }

  client.application?.commands.set(
    client.commands.map((command) => command.builder.toJSON())
  );

  commandsTable.print();
}

export async function handleButtonInteractions(interaction: ButtonInteraction) {
  await interaction.reply({
    content: "There is no button interactions yet.",
    ephemeral: true,
  });
  logger.warn("Button interactions unavailable", {
    action: "button",
    context: interaction.context,
  });
}

export async function handleChatInputCommands(
  interaction: ChatInputCommandInteraction
) {
  const command = interaction.client.commands.get(interaction.commandName);
  const commandLogger = logger.child({
    action: "command",
    context: interaction.context,
    command,
  });

  if (!command) {
    commandLogger.warn("Outdated command");
    return await interaction.reply({
      content: "The command you specified is propably outdated.",
      ephemeral: true,
    });
  }

  const interactionUser = interaction.guild?.members.cache.get(
    interaction.user.id
  );

  if (!interactionUser) {
    commandLogger.warn("Cannot execute", { user_id: interaction.user.id });
    return await interaction.reply({
      content: "You cannot execute commands here.",
      ephemeral: true,
    });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (error instanceof Error) logger.error(error);
    else
      logger.error("Command couldn't be handled", {
        action: "command",
        name: command.displayName,
        category: command.category,
        handler: command.execute,
      });
    return await interaction.reply({
      content: "Something went wrong. Please try again later.",
      ephemeral: true,
    });
  }
}
