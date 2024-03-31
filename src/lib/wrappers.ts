import type { TableElement } from "@lib/types";
import {
	CacheType,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder,
} from "discord.js";

export function embed(
	title: string,
	color: ColorResolvable,
	interaction: ChatInputCommandInteraction<CacheType>
) {
	return new EmbedBuilder()
		.setTitle(title)
		.setColor(color)
		.setFooter({ text: title })
		.setTimestamp(interaction.createdTimestamp);
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
