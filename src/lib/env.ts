import { z } from "zod";

const envSchema = z.object({
	Token: z.string(),
	Weather: z.string(),
	ChannelsWelcome: z.string(),
	ChannelsLogs: z.string(),
	RolesMember: z.string(),
	RolesBot: z.string(),
	RolesDeveloper: z.string(),
	RolesModerator: z.string(),
});

export const env = envSchema.parse(Bun.env);

