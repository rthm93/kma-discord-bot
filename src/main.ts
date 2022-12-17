import { Client, Events, GatewayIntentBits } from 'discord.js';
import { scalpEpicAndNotifyEveryone } from './update-epic-games.js';
import * as _ from './config.json'; // Add dependency to config.json, ignore this warning.

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('./config.json');
console.log(config);

if (config && config.botToken && config.channelId) {
  await startBotAsync();
} else {
  console.error('Invalid config: ', config);
}

async function startBotAsync(): Promise<void> {
  // Create a new client instance
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.once(Events.ClientReady, async (c) => {
    console.log(`Bot Ready! Logged in as ${c.user.tag}`);

    const checkInterval = parseInt(config.checkInterval) || 30;
    console.log(
      `Start checking for Epic Free Games every ${checkInterval} minutes...`,
    );

    setInterval(async () => {
      await scalpEpicAndNotifyEveryone(c, config.channelId, config.countryCode);
    }, checkInterval * 60 * 1000);
  });

  // Log in to Discord with your client's token
  client.login(config.botToken);
}
