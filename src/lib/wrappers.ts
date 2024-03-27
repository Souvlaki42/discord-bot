import type { TableElement } from "@lib/types";
import {
	CacheType,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder,
	Channel,
	Client,
	Interaction,
	Role,
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

export async function assertChannel<T extends Channel>(
	channelId: string,
	client: Client<boolean>
): Promise<T> {
	const channel = await client.channels.fetch(channelId);
	if (!channel) throw new Error(`Channel with ${channelId} doesn't exist!`);
	else return channel as T;
}

export async function assertRole<T extends Role>(
	roleId: string,
	interaction: Interaction<CacheType>
): Promise<T> {
	const role = await interaction.guild?.roles.fetch(roleId);
	if (!role) throw new Error(`Role with ${roleId} doesn't exist!`);
	else return role as T;
}
