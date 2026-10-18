import { ICON_QUESTION_MARK } from "./Constants";
import { gameData } from "./GameData";
import { substringLevenshtein } from "./Levenshtein";

export function resolve_mod_image_path(path: string | null | undefined): string;
export function resolve_mod_image_path(path: string | null | undefined, mod: ModInfo): string;
export function resolve_mod_image_path(path: string | null | undefined, mod?: ModInfo): string {
  if (path == null) {
    return ICON_QUESTION_MARK;
  }

  const cleanPath = path.replace(/^\/+/, '');
  return mod
    ? `/GameSources/mods/${mod.directory}/${cleanPath}`
    : `/GameSources/mods/${cleanPath}`;
}
export function capitalize(s: string | undefined) { return ((s?.[0] ?? "NULL").toUpperCase() + (s ?? "NULL").slice(1).toLowerCase()).replace("_", " "); }

const MAX_DISTANCE = 2;

function isShipLegit(args: { ship?: ShipJSON, skin?: Skin, modId?: string, filter?: string; } = {}) {
  args = { ...{ modId: "starsector-core", filter: "" }, ...args };
  const owner = args.skin?.owner ?? args.ship?.owner;
  if (!args.ship) return false;
  if (owner !== args.modId) return false;
  if (args.ship.hullSize === "FIGHTER") return false;
  if (args.skin?.restoreToBaseHull) return false;
  const csvId = args.skin ? args.skin.baseHullId : args.ship.hullId;
  const csv = gameData.ship_data.find(s => s.id === csvId);
  if (!csv) return false;
  if (csv.hints.includes("HIDE_IN_CODEX")) return false;
  if (csv.hints.includes("STATION")) return false;
  if (csv.name.startsWith("#")) return false;
  if (args.filter) {
    const nameToSearch = args.skin ? args.skin.hullName : csv.name;
    if (substringLevenshtein(nameToSearch, args.filter) > MAX_DISTANCE) {
      return false;
    }
  }
  return true;
}

export function getShipCandidates(filter: string, modID: string) {
  type ShipCandidate =
    | {
      type: 'ship';
      ship: ShipJSON;
      skin?: never;
      csv: ShipCSV;
    }
    | {
      type: 'skin';
      ship: ShipJSON;
      skin: Skin;
      csv: ShipCSV;
    };

  const candidates: ShipCandidate[] = [];

  //#region add ships to the list
  for (const ship of gameData.ships) {
    if (!isShipLegit({ ship: ship, modId: modID, filter: filter })) continue;

    const csv = gameData.ship_data.find(s => s.id === ship.hullId)!;
    candidates.push({ type: 'ship', ship, csv });
  }
  //#endregion

  //#region add skins to the list
  for (const skin of gameData.skins) {
    const ship = gameData.ships.find(s => s.hullId === skin.baseHullId);
    if (!ship) continue; // if base hulls missing skip

    if (!isShipLegit({ ship: ship, skin, modId: modID, filter })) continue;

    const csv = gameData.ship_data.find(s => s.id === skin.baseHullId)!;
    candidates.push({ type: 'skin', skin, ship, csv });
  }
  //#endregion

  //#region sort
  candidates.sort((a, b) => {
    const nameA = firstNonEmpty(a.csv?.name, a.skin?.hullName, a.ship?.hullName);
    const nameB = firstNonEmpty(b.csv?.name, b.skin?.hullName, b.ship?.hullName);
    return nameA.localeCompare(nameB);
  });
  //#endregion

  return candidates;
}

export function firstNonEmpty(...vals: (string | undefined)[]) {
  const retVal = vals.find(v => v != null && v !== "");
  if (retVal)
    return retVal;

  return "Unknown";
}