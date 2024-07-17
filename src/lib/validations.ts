import { z } from "zod";

export const envSchema = z.object({
	Token: z.string(),
	Database: z.string(),
});

export const env = envSchema.parse(Bun.env);
