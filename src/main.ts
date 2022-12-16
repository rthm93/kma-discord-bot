import { Client, Events, GatewayIntentBits, TextChannel } from 'discord.js';
import { getGames } from 'epic-free-games';
import { format } from 'date-fns';

const channelId = '719191346149195842';
const botToken =
  'NzE1MjM1MDg0NzMwNjMwMjI2.GjIGf9.h0acew8s2ETQ-m7palRsvoUFTEGXJUzODtKENw';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  console.log(`Bot Ready! Logged in as ${c.user.tag}`);
  console.log(`Start interval...`);

  await scalpEpicAndNotifyEveryone(c);

  // setInterval(async () => {
  //   await scalpEpicAndNotifyEveryone(c);
  // }, 10000);
});

async function scalpEpicAndNotifyEveryone(c: Client<true>) {
  try {
    console.log(`Getting free games from epic`);
    const { currentGames } = await getGames('MY' as any, true);

    if (!currentGames || !currentGames.length) {
      console.warn('No free games :(');
      return;
    }

    const messages: Array<{ message: string; files: string[] }> = [];

    for (let game of currentGames) {
      const gameMessage = `${game.title}\n${game.description}`;
      console.log(`Free game: ${gameMessage}`);
      messages.push({
        message: gameMessage,
        files: game.keyImages
          .filter((i) => i.type !== 'VaultClosed')
          .map((i) => i.url),
      });
    }

    if (messages && messages.length) {
      const channel = c.channels.cache.get(channelId);

      if (channel && channel instanceof TextChannel) {
        const textChannel = channel as TextChannel;
        await textChannel.send(
          `**Epic Games Free Games Update on ${format(
            new Date(2014, 1, 11),
            'dd MMM yyyy',
          )}**`,
        );

        for (let message of messages) {
          textChannel.send({
            content: message.message,
            embeds: message.files.map((url) => ({ image: { url } })),
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Log in to Discord with your client's token
client.login(botToken);
