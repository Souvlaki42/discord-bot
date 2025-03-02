import { Client, GatewayIntentBits, Partials } from "discord.js";
import { loadCommands } from "~/handlers/commands";
import { loadEvents } from "~/handlers/events";
import { logger } from "~/lib/logger";
import { env } from "~/lib/utils";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.Channel,
    Partials.Message,
  ],
});

async function gracefulShutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  try {
    console.log("Disconnecting from Discord...");
    await client.destroy();
    console.log("Disconnected from Discord.");
    console.log("Cleanup tasks complete.");
    console.log("Shutdown complete. Exiting.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", gracefulShutdown); // Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Termination signal (e.g., from Docker)
process.on("SIGUSR2", gracefulShutdown); // Nodemon restart signal

try {
  await client.login(env.TOKEN);
  await loadEvents(client);
  await loadCommands(client);
} catch (error) {
  if (error instanceof Error) logger.error(error);
  else
    logger.error("Failure was inevitable", {
      error,
    });
  process.exit(1);
}
