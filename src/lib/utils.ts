import {
  ChatInputCommandInteraction,
  type ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { z } from "zod";
import { type TableElement } from "./types";
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

export class Table {
  #elements: TableElement[];
  #title: string;
  #dashNumber: number;
  constructor(title: string, dashNumber: number) {
    this.#elements = [];
    this.#title = title;
    this.#dashNumber = dashNumber;
  }
  push(elem: TableElement): void {
    this.#elements.push(elem);
  }
  print(): void {
    const wholeLineDashNumber = 2 * this.#dashNumber + 2 + this.#title.length;
    console.log(
      `${"-".repeat(this.#dashNumber)} ${this.#title} ${"-".repeat(
        this.#dashNumber
      )}`
    );
    console.log("-".repeat(wholeLineDashNumber));
    if (this.#elements.length === 0) {
      console.log(
        `There is no ${[...this.#title]
          .slice(0, -1)
          .join("")
          .toLowerCase()} files at all!`
      );
    } else {
      this.#elements.map((element, index) => {
        console.log(
          ` ${index + 1}. | ${element.status} | ${element.name} - ${
            element.category
          }`
        );
      });
    }
    console.log(`${"-".repeat(wholeLineDashNumber)}\n`);
  }
}
