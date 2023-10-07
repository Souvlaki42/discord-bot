import { CacheType, Channel, Client, Interaction, Role } from "discord.js";

export async function assertChannel<T extends Channel>(
	channelId: string,
	client: Client<boolean>
): Promise<T> {
	const channel = await client.channels.fetch(channelId);
	if (!channel) throw new Error(`Channel ${channelId} doesn't exist!`);
	else return channel as T;
}

export async function assertRole<T extends Role>(
	roleId: string,
	interaction: Interaction<CacheType>
): Promise<T> {
	const role = await interaction.guild?.roles.fetch(roleId);
	if (!role) throw new Error(`Channel ${roleId} doesn't exist!`);
	else return role as T;
}
