import { z } from "zod";

const envSchema = z.object({
	Token: z.string(),
});

export const env = envSchema.parse(Bun.env);
export type Env = z.infer<typeof envSchema>;
