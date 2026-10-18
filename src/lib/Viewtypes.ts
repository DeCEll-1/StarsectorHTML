import ShipView from "../components/ViewComponents/ShipView.svelte";

export enum ViewType {
  None = "None",
  Ship = "Ship",
}

export type ViewState =
  | { type: ViewType.None; }
  | {
    type: ViewType.Ship;
    csv?: ShipCSV;
    ship?: ShipJSON;
    skin?: Skin;
  }
  // | { type: ViewType.Weapon; weaponId: string; damage: number }
  ;

export const ViewStateFactory = {
  none: { type: ViewType.None } as ViewState,

  ship:
    (csv?: ShipCSV, ship?: ShipJSON, skin?: Skin, rightClickSystem?: System): ViewState => {
      return {
        type: ViewType.Ship,
        csv,
        ship,
        skin,
      };
    },
  shipn: { type: ViewType.Ship } as ViewState

};