import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export class LastGameStore {
  private readonly lastGameFile = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'last-game',
  );

  get lastOfferGames(): string[] {
    const contents = fs.existsSync(this.lastGameFile)
      ? fs.readFileSync(this.lastGameFile).toString()
      : '';

    return contents.split(',');
  }

  set lastOfferGames(value: string[]) {
    fs.writeFileSync(this.lastGameFile, (value || []).join(','));
  }
}
