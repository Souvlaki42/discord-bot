import { customTable } from "@lib/templates";
import { Command, TableElement } from "@lib/types";
import {
	ButtonInteraction,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Collection,
} from "discord.js";
import { glob } from "glob";
import path from "path";

export async function loadCommands(client: Client) {
	const tableCommands: TableElement[] = [];

	if (!client.commands) client.commands = new Collection();
	client.commands.clear();

	if (!client.application) return;
	client.application.commands.cache.clear();

	const files = await glob(path.join(process.cwd(), "src/commands", "**/*.ts"));

	for await (const file of files) {
		try {
			const { command }: { command: Command } = await import(file);

			client.commands.set(command.data.name, command);

			tableCommands.push({
				name: command.displayName,
				category: command.category,
				status: "✅",
			});
		} catch {
			tableCommands.push({
				name: file.split("/").at(-1),
				category: "Unknown",
				status: "🛑",
			});
		}
	}

	client.application?.commands.set(
		client.commands.map((command) => command.data.toJSON())
	);

	customTable({ text: "Commands", dashNumber: 15 }, tableCommands);
}

export async function handleButtonInteractions(
	interaction: ButtonInteraction<CacheType>
) {
	await interaction.reply({
		content: "There is no button interactions yet.",
		ephemeral: true,
	});
}

export async function handleChatInputCommands(
	interaction: ChatInputCommandInteraction<CacheType>
) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command)
		return await interaction.reply({
			content: "The command you specified is propably outdated.",
			ephemeral: true,
		});

	const interactionUser = interaction.guild?.members.cache.get(
		interaction.user.id
	);

	if (!interactionUser)
		return await interaction.reply({
			content: "You cannot execute commands here.",
			ephemeral: true,
		});

	return await command.execute(interaction);
}

