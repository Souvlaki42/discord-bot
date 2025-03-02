import {
  Colors,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { logger } from "~/lib/logger";
import { type Command, embed } from "~/lib/utils";

export default {
  builder: new SlashCommandBuilder()
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
    const kickLogger = logger.child({
      action: "kick",
      user_id: interaction.user.id,
      target_id: target?.id,
    });

    if (!target || !member) {
      kickLogger.warning("Target no longer in server");
      return await interaction.reply({
        content: "The user you selected is no longer a member of this server.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (interaction.user.id === target.id) {
      kickLogger.warning("User tried to kick themselves");
      return await interaction.reply({
        content: "You cannot kick yourself.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!member.kickable) {
      kickLogger.warning("Target has more permissions");
      return await interaction.reply({
        content: "The user you selected has permissions above us.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const dmEmbed = embed(
      "Kick",
      `:white_check_mark: You have been kicked from **${interaction.guild?.name}** | ${reason}.`,
      interaction,
      Colors.Blue
    );

    const channelEmbed = embed(
      "Kick",
      `:white_check_mark: ${target.tag} has been **kicked** | ${reason}.`,
      interaction,
      Colors.Blue
    );

    await member.send({ embeds: [dmEmbed] });

    await member.kick(reason);

    return await interaction.reply({ embeds: [channelEmbed] });
  },
} satisfies Command;
