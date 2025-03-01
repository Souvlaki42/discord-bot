import {
  ChatInputCommandInteraction,
  type ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { z } from "zod";
export * from "./types";

const envSchema = z.object({
  TOKEN: z.string(),
  LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse(Bun.env);

export type Env = z.infer<typeof envSchema>;

export function embed(
  title: string,
  description: string,
  interaction?: ChatInputCommandInteraction,
  color: ColorResolvable = "Random",
  footer?: string
) {
  const embedObj = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter({ text: footer ?? title });

  if (interaction) embedObj.setTimestamp(interaction.createdTimestamp);

  return embedObj;
}
