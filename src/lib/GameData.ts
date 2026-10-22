import rawData from './data/merged_game_sources.json';

export const gameData: Global = rawData as Global;

gameData.modsMap = new Map<string, ModInfo>();

for (const mod of gameData.mods) {
  gameData.modsMap.set(mod.id, mod);
}

gameData.spritesMap = new Map<string, ModInfo[]>();

// instead of having sprite path > mod we have a sprite path > mods as a sprite path can exist on multiple mods,
// this also allows us to have prioritisations and whatnot

for (const sprite of gameData.sprites) {

  if (!gameData.spritesMap.has(sprite.relativePath)) {
    gameData.spritesMap.set(sprite.relativePath, []);
  }

  gameData.spritesMap.get(sprite.relativePath)?.push(gameData.modsMap.get(sprite.owner)!);
}