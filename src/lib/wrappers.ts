import type { TableElement } from "@lib/types";
import {
	CacheType,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder,
} from "discord.js";
import pino from "pino";

export const logger = pino();

export function embed(
	title: string,
	description: string,
	interaction?: ChatInputCommandInteraction<CacheType>,
	color: ColorResolvable = "Random",
	footer?: string
) {
	return new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(color)
		.setFooter({ text: footer ?? title })
		.setTimestamp(interaction?.createdTimestamp);
}

export function table(
	title: { text: string; dashNumber: number },
	elements: TableElement[]
): void {
	const wholeLineDashNumber = 2 * title.dashNumber + 2 + title.text.length;
	console.log(
		`${"-".repeat(title.dashNumber)} ${title.text} ${"-".repeat(
			title.dashNumber
		)}`
	);
	console.log("-".repeat(wholeLineDashNumber));
	if (elements.length === 0) {
		console.log(
			`There is no ${[...title.text]
				.slice(0, -1)
				.join("")
				.toLowerCase()} files at all!`
		);
	} else {
		elements.map((element, index) => {
			console.log(
				` ${index + 1}. | ${element.status} | ${element.name} - ${
					element.category
				}`
			);
		});
	}
	console.log("-".repeat(wholeLineDashNumber) + "\n");
}
