import { ViewStateFactory, type ViewState } from "./Viewtypes";
import { gameData } from "./GameData";
import { getShipCandidates } from "./Utils";

class NavigationState {
  selectedView = $state<ViewState>(ViewStateFactory.none);
  selectedMod = $state<ModInfo>(
    gameData.mods.find((s) => s.id == "starsector-core")!
  );

  selectShipById(shipId: string, modID: string): boolean {
    const target = getShipCandidates("", modID).find(s => {
      if (s.skin) {
        return s.skin.skinHullId == shipId;
      }
      return s.csv.id == shipId;
    });

    if (target) {
      this.selectedMod = gameData.mods.find(s => s.id == modID)!;
      this.selectedView = ViewStateFactory.ship(target.csv, target.ship, target.skin);
      return true;
    }

    console.warn(`Ship with ID "${shipId}" not found in any mod.`);
    return false;
  }
}

export const navState = new NavigationState();