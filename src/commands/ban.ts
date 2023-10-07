import {
	Colors,
	Command,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "@/lib/types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Bans a member from the server.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("The user you want to ban.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason you want to ban the member.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	category: "Moderation",
	displayName: "Ban",
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

		if (!member.bannable)
			return await interaction.reply({
				content: "The user you selected has permissions above us.",
				ephemeral: true,
			});

		if (interaction.user.id === target.id)
			return await interaction.reply({
				content: "You cannot ban yourself.",
				ephemeral: true,
			});

		const dmEmbed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setDescription(
				`:white_check_mark: You have been banned from **${interaction.guild?.name}** | ${reason}.`
			)
			.setFooter({ text: "Ban" })
			.setTimestamp();

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setDescription(
				`:white_check_mark: ${target.tag} has been **banned** | ${reason}.`
			)
			.setFooter({ text: "Ban" })
			.setTimestamp();

		await target.send({ embeds: [dmEmbed] });

		await interaction.guild?.bans.create(target.id, { reason });

		return await interaction.reply({ embeds: [embed] });
	},
};

