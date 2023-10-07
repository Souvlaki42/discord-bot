import {
	Colors,
	Command,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "@/lib/types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks a member from the server.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("The user you want to kick.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason you want to kick the member.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	category: "Moderation",
	displayName: "Kick",
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const reason =
			interaction.options.getString("reason") ?? "No reason specified.";
		const member = await interaction.guild?.members.fetch(target?.id || "");

		if (!target || !member)
			return await interaction.reply({
				content: "The user you selected is no longer a member of this server.",
				ephemeral: true,
			});

		if (!member.kickable)
			return await interaction.reply({
				content: "The user you selected has permissions above us.",
				ephemeral: true,
			});

		if (interaction.user.id === target.id)
			return await interaction.reply({
				content: "You cannot kick yourself.",
				ephemeral: true,
			});

		const dmEmbed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setDescription(
				`:white_check_mark: You have been kicked from **${interaction.guild?.name}** | ${reason}.`
			)
			.setFooter({ text: "Kick" })
			.setTimestamp();

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setDescription(
				`:white_check_mark: ${target.tag} has been **kicked** | ${reason}.`
			)
			.setFooter({ text: "Kick" })
			.setTimestamp();

		await member.send({ embeds: [dmEmbed] });

		await member.kick(reason);

		return await interaction.reply({ embeds: [embed] });
	},
};

