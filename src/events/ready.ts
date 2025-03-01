import { logger } from "~/lib/logger";
import type { Event } from "~/lib/utils";

export default {
  name: "ready",
  displayName: "Ready",
  category: "Client",
  once: true,
  rest: false,
  execute: async (client) => {
    client.user.setActivity(`with ${client.guilds.cache.size} guilds(s)`);
    logger.info(`Logged in as ${client.user.tag}!`);
  },
} satisfies Event<"ready">;
