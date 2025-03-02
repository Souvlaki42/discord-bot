import { Colors, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { logger } from "~/lib/logger";
import { type Command, embed } from "~/lib/utils";

export default {
  builder: new SlashCommandBuilder()
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
    const banLogger = logger.child({
      action: "ban",
      user_id: interaction.user.id,
      target_id: target?.id,
    });

    if (!target || !member) {
      banLogger.warn("Target specified no longer in the server");
      return await interaction.reply({
        content: "The user you selected is no longer a member of this server.",
        ephemeral: true,
      });
    }

    if (interaction.user.id === target.id) {
      banLogger.warn("User tried to ban themselves");
      return await interaction.reply({
        content: "You cannot ban yourself.",
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      banLogger.warn("User tried banning an admin");
      return await interaction.reply({
        content: "The user you selected has permissions above us.",
        ephemeral: true,
      });
    }

    const dmEmbed = embed(
      "Ban",
      `:white_check_mark: You have been banned from **${interaction.guild?.name}** | ${reason}.`,
      interaction,
      Colors.Red
    );

    const channelEmbed = embed(
      "Ban",
      `:white_check_mark: ${target.tag} has been **banned** | ${reason}.`,
      interaction,
      Colors.Red
    );

    await target.send({ embeds: [dmEmbed] });

    await interaction.guild?.bans.create(target.id, { reason });

    return await interaction.reply({ embeds: [channelEmbed] });
  },
} satisfies Command;
