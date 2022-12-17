import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { getGames, OfferGame } from 'epic-free-games';
import dayjs from 'dayjs';
import { LastGameStore } from './stores/last-game.store.js';

const defaultCountry = 'MY';

export async function scalpEpicAndNotifyEveryone(
  c: Client<true>,
  channelId: string,
  countryCode: string = defaultCountry,
): Promise<void> {
  try {
    console.log(`Getting free games from epic`);
    const { currentGames } = await getGames(
      (countryCode || defaultCountry) as any,
      true,
    );

    if (!currentGames || !currentGames.length) {
      console.warn('No free games :(');
      return;
    }

    if (currentGames && currentGames.length && anyNewGames(currentGames)) {
      const channel = c.channels.cache.get(channelId);

      if (channel && channel instanceof TextChannel) {
        const textChannel = channel as TextChannel;
        await textChannel.send(
          `**Epic Games Free Games Update on ${dayjs().format('D MMM YYYY')}**`,
        );

        for (const game of currentGames) {
          console.log(`Free game: ${game.title}\n${game.description}`);

          const embed = new EmbedBuilder()
            .setColor(0xefff00)
            .setTitle(game.title)
            .addFields({
              name: 'Intro',
              value: game.description,
            });

          const images =
            game.keyImages && game.keyImages
              ? game.keyImages
                  .filter((i) => i.type !== 'VaultClosed')
                  .map((x) => x.url)
              : [];

          if (images && images.length) {
            embed.setImage(images[0]);
          }

          textChannel.send({
            content: '',
            embeds: [embed],
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function anyNewGames(offerGames: OfferGame[]): boolean {
  offerGames.forEach((game) => console.log(`${game.title} is free now.`));

  const store = new LastGameStore();
  const previousGames = store.lastOfferGames;

  if (!previousGames || !previousGames.length) {
    return true;
  }

  if (!offerGames.every((g) => previousGames.find((c) => g.id === c))) {
    store.lastOfferGames = offerGames.map((g) => g.id);
    return true;
  }

  console.warn(`There are no new free games.`);
  return false;
}
