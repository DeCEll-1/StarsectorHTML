import rawData from './data/merged_game_sources.json';

// Typecast the imported JSON using your global interfaces
export const gameData: Global = rawData as Global;