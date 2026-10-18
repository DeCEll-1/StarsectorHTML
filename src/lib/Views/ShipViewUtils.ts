// idk howw to name files, this file will just "turn" objects into other objects by using the global game data

import Enumerable from "linq";
import { gameData } from "../GameData";
import { capitalize, firstNonEmpty, resolve_mod_image_path } from "../Utils";

export function getShipByWingId(wingId: string): ShipCSV | undefined {
  const variantID = gameData.wing_data.find((s) => s.id == wingId)?.variant;
  const variant = gameData.variants.find((s) => s.variantId == variantID);
  return gameData.ship_data.find((s) => s.id == variant?.hullId);
}

export function getDefenseStats(csv: ShipCSV, shieldType: string, hasDefenseID: boolean, right_click_system?: System) {
  let defenseType = capitalize(
    right_click_system?.name ??
    {
      FRONT: "Front Shield",
      OMNI: "Shield",
      PHASE: "Phase Cloak",
      NONE: "None",
    }[shieldType] ?? "—"
  );

  let prop1Name = "\u00A0", prop1Val = "";
  let prop2Name = "\u00A0", prop2Val = "";
  let prop3Name = "\u00A0", prop3Val = "";

  if ((shieldType === "FRONT" || shieldType === "OMNI") && !hasDefenseID) {
    prop1Name = "Shield arc";
    prop1Val = csv["shield arc"] ?? "";
    prop2Name = "Shield upkeep/sec";
    prop2Val = csv["shield upkeep"] && csv["flux dissipation"]
      ? (parseFloat(csv["shield upkeep"]) * parseFloat(csv["flux dissipation"])).toFixed(1)
      : "";
    prop3Name = "Shield flux/damage";
    prop3Val = csv["shield efficiency"] ? parseFloat(csv["shield efficiency"]).toFixed(1) : "";
  } else if (shieldType === "PHASE" && hasDefenseID) {
    const flux = Number(csv["max flux"]) ?? 0;
    prop1Name = "Cloak activation cost";
    prop1Val = csv["phase cost"] ? String(Number(csv["phase cost"]) * flux) : "";
    prop2Name = "Cloak upkeep/sec";
    prop2Val = csv["phase upkeep"] ? String(Number(csv["phase upkeep"]) * flux) : "";
  }

  return { defenseType, prop1Name, prop1Val, prop2Name, prop2Val, prop3Name, prop3Val };
}

export function getWeaponMounts(ship: ShipJSON, skin?: Skin) {
  const slots: WeaponSlot[] = (ship.weaponSlots ?? [])
    .map((slot): WeaponSlot | null => {
      slot = skin?.weaponSlotChanges?.[slot.id]
        ? { ...slot, ...skin.weaponSlotChanges[slot.id] }
        : slot;
      if (slot.mount === "HIDDEN" || slot.type === "SYSTEM" || slot.type === "DECORATIVE")
        return null;
      if (skin?.removeWeaponSlots?.includes(slot.id)) return null;
      return slot;
    })
    .filter(Boolean) as WeaponSlot[];

  const order = ["LARGE", "MEDIUM", "SMALL"];
  slots.sort((a, b) => order.indexOf(a?.size as string) - order.indexOf(b?.size as string));

  const counts: Record<string, number> = slots.reduce((acc, s) => {
    const key = `${s.type}|${s.size}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts).map(([key, count]) => {
    const [type, size] = key.split("|");
    return { count, size, type };
  });
}

export function getArmaments(ship: ShipJSON) {
  let armaments: { count: number; armamentName?: string; }[] = [];

  if (ship.builtInWeapons) {
    armaments = armaments.concat(
      Enumerable.from(Object.values(ship.builtInWeapons))
        .groupBy((s) => s)
        .select((wid) => {
          const wida = wid.toArray();
          const id = Object.values(wida)[0];
          const count = Object.values(wida).length;
          return {
            count,
            armamentName: gameData.weapon_data.find((s: any) => s.id == id)?.name,
          };
        })
        .toArray()
    );
  }

  if (ship.builtInWings) {
    armaments = armaments.concat(
      Enumerable.from(ship.builtInWings)
        .groupBy((s) => s)
        .select((wid) => {
          const wida = wid.toArray();
          const id = Object.values(wida)[0];
          const wingShip = getShipByWingId(id);
          const count = Object.values(wida).length;
          return {
            count,
            armamentName: wingShip?.name,
          };
        })
        .toArray()
    );
  }

  return armaments as { count: number; armamentName: string; }[];
}

export function getHullmods(ship: ShipJSON, skin?: Skin) {
  const builtInMods = Object.values(ship.builtInMods ?? {})
    .concat(skin?.builtInMods ?? [])
    .filter((s) => !(skin?.removeBuiltInMods ?? []).includes(s));

  return gameData.hull_mods.filter((m: Hullmod) => builtInMods.includes(m.id));
}

export function getDescriptionLines(description?: Description) {
  return ([
    description?.text1,
    description?.text2,
    description?.text3,
    description?.text4,
    description?.text5,
  ].filter(Boolean) as string[]).join("\r\n").split("\r\n");
}

export function getSpritePath(ship: ShipJSON, skin?: Skin) {
  const spritePath = firstNonEmpty(skin?.spriteName, ship.spriteName);
  const modOwner = skin ? skin.owner : ship.owner;
  const mod = gameData.mods.find((s: any) => s.id == modOwner);
  return resolve_mod_image_path(spritePath, mod!);
}