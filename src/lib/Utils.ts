import { ICON_QUESTION_MARK } from "./Constants";
import { gameData } from "./GameData";
import { substringLevenshtein } from "./Levenshtein";
import { type ViewState, ViewType } from './Viewtypes';

export function resolve_mod_image_path(path: string | null | undefined): string;
export function resolve_mod_image_path(path: string | null | undefined, mod: ModInfo): string;
export function resolve_mod_image_path(path: string | null | undefined, mod?: ModInfo): string {
  if (path == null || !gameData.spritesMap.has(path))
    return ICON_QUESTION_MARK;

  const modsWithSprite = gameData.spritesMap.get(path)!;

  let targetMod: ModInfo;

  if (modsWithSprite.length == 1)
    // if theres just 1 mod with with the sprite then use that sprite
    targetMod = modsWithSprite[0];
  else {// if we have multiple...
    if (modsWithSprite.find(s => s == mod))
      targetMod = mod!;//...and if the mod in the paramater exists in the sprites, use that
    else if (modsWithSprite.find(s => s.id == "starsector-core"))
      targetMod = gameData.modsMap.get("starsector-core")!; // if not prioratize starsector-core
    else // otherwise return question mark
      return ICON_QUESTION_MARK // TODO: add a tooltip somehow to show that there were multiple options but none was "guarantee"
  }

  const cleanPath = path.replace(/^\/+/, '');
  return  `/GameSources/mods/${targetMod.directory}/${cleanPath}`;
}

export function resolve_mod_icon(path: string | null | undefined, mod?: ModInfo): string {
  if (path == null)
    return ICON_QUESTION_MARK;

  const cleanPath = path.replace(/^\/+/, '');
  return  `/GameSources/mods/${cleanPath}`;
}

export function capitalize(s: string | undefined) { return ((s?.[0] ?? "NULL").toUpperCase() + (s ?? "NULL").slice(1).toLowerCase()).replace("_", " "); }

export function firstNonEmpty(...vals: (string | undefined)[]) {
  const retVal = vals.find(v => v != null && v !== "");
  if (retVal)
    return retVal;

  return "Unknown";
}

export function getSearchBarPlaceholder(state: ViewState): string {
  return "Search for (/, ', \") " + {
    [ViewType.None]: "",
    [ViewType.Ship]: "ships...",
  }[state.type];
}