export { };

declare global {
  interface Variant {
    displayName?    : string;
    goalVariant?    : string;
    fluxCapacitors? : number;
    fluxVents?      : number;
    hullId?         : string;
    hullMods?       : any[];
    permaMods?      : any[];
    sMods?          : any[];
    variantId?      : string;
    weaponGroups?   : any[];
    owner?          : string;
    wings?          : any[];
    modules?        : any[] | any;
    quality?        : number;
    mods?           : any[];
    suppressedMods? : any[];
    tags?           : any[];
  }
}