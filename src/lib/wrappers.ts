import type { CommandCategory, EventCategory, TableElement } from "@lib/types";
import {
	CacheType,
	ChatInputCommandInteraction,
	ClientEvents,
	ColorResolvable,
	EmbedBuilder,
	InteractionResponse,
	RestEvents,
	SlashCommandBuilder,
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
	const embedObj = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(color)
		.setFooter({ text: footer ?? title });

	if (interaction) embedObj.setTimestamp(interaction.createdTimestamp);

	return embedObj;
}

type EventArgs<N extends keyof (ClientEvents & RestEvents)> = {
	name: N;
	displayName?: string;
	category: EventCategory;
	once?: boolean;
	rest?: N extends keyof RestEvents ? true : false;
	execute: (
		...args: N extends keyof RestEvents
			? RestEvents[N]
			: N extends keyof ClientEvents
			? ClientEvents[N]
			: never
	) => Promise<void>;
};
export const event = <N extends keyof (ClientEvents & RestEvents)>({
	name,
	displayName,
	category,
	once = false,
	rest,
	execute,
}: EventArgs<N>) => {
	return {
		name,
		displayName,
		category,
		once,
		rest,
		execute,
	};
};

type CommandArgs = {
	builder: SlashCommandBuilder;
	displayName?: string;
	category: CommandCategory;
	execute: (
		interaction: ChatInputCommandInteraction<CacheType>
	) => Promise<InteractionResponse<boolean>>;
};
export const command = ({
	builder,
	displayName,
	category,
	execute,
}: CommandArgs) => {
	return {
		builder,
		displayName,
		category,
		execute,
	};
};

export function table(
	elements: TableElement[],
	title: string,
	dashNumber: number
) {
	const wholeLineDashNumber = 2 * dashNumber + 2 + title.length;
	console.log(`${"-".repeat(dashNumber)} ${title} ${"-".repeat(dashNumber)}`);
	console.log("-".repeat(wholeLineDashNumber));
	if (elements.length === 0) {
		console.log(
			`There is no ${[...title]
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
	console.log(`${"-".repeat(wholeLineDashNumber)}\n`);
}
