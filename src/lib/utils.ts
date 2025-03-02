import {
  ChatInputCommandInteraction,
  type ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { z } from "zod";
export * from "./types";

const envSchema = z.object({
  TOKEN: z
    .string({
      invalid_type_error: "The token needs to be a string",
      description: "This is your 'API_KEY' for the Discord API",
      required_error: "I think you forgot the token. It's important",
    })
    .min(
      20,
      "Make sure you put a valid Discord token. It shouldn't be that small"
    ),
  LOG_LEVEL: z.string({
    invalid_type_error: "The log level needs to be a string",
    description: "This is the default level of the logger",
  }),
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
