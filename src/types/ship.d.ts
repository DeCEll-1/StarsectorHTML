export { };

declare global {
    export interface ShipCSV {
        name                              : string;
        id                                : string;
        designation                       : string;
        "tech/manufacturer"               : string;
        "system id"                       : string;
        "fleet pts"                       : string;
        hitpoints                         : string;
        "armor rating"                    : string;
        "max flux"                        : string;
        "8/6/5/4%"                        : string;
        "flux dissipation"                : string;
        "ordnance points"                 : string;
        "fighter bays"                    : string;
        "max speed"                       : string;
        acceleration                      : string;
        deceleration                      : string;
        "max turn rate"                   : string;
        "turn acceleration"               : string;
        mass                              : string;
        "shield type"                     : string;
        "defense id"                      : string;
        "shield arc"                      : string;
        "shield upkeep"                   : string;
        "shield efficiency"               : string;
        "phase cost"                      : string;
        "phase upkeep"                    : string;
        "min crew"                        : string;
        "max crew"                        : string;
        cargo                             : string;
        fuel                              : string;
        "fuel/ly"                         : string;
        range                             : string;
        "max burn"                        : string;
        "base value"                      : string;
        "cr %/day"                        : string;
        "CR to deploy"                    : string;
        "peak CR sec"                     : string;
        "CR loss/sec"                     : string;
        "supplies/rec"                    : string;
        "supplies/mo"                     : string;
        "c/s"                             : string;
        "c/f"                             : string;
        "f/s"                             : string;
        "f/f"                             : string;
        "crew/s"                          : string;
        "crew/f"                          : string;
        hints                             : string;
        tags                              : string;
        "logistics n/a reason"            : string;
        "codex variant id"                : string;
        rarity                            : string;
        breakProb                         : string;
        minPieces                         : string;
        maxPieces                         : string;
        "travel drive"                    : string;
        "number"                          : string;
    }

    export interface ShipJSON {
        bounds                            : number[];
        builtInWeapons                    : BuiltInWeapons;
        builtInMods                       : string[];
        builtInWings                      : string[];
        center                            : number[];
        collisionRadius                   : number;
        owner                             : string;
        coversColor                       : string;
        engineSlots                       : EngineSlot[];
        height                            : number;
        hullId                            : string;
        hullName                          : string;
        hullSize                          : string;
        shieldCenter                      : number[];
        shieldRadius                      : number;
        spriteName                        : string;
        style                             : string;
        viewOffset                        : number;
        weaponSlots                       : WeaponSlot[];
        width                             : number;
    }

    export interface EngineSlot {
        angle                             : number;
        contrailSize                      : number;
        length                            : number;
        location                          : number[];
        style                             : string;
        width                             : number;
    }

    export interface WeaponSlot {
        angle                             : number;
        arc                               : number;
        id                                : string;
        locations                         : number[];
        mount                             : Mount;
        size                              : Size;
        type                              : WeaponTypes;
    }

    export interface Skin {
        owner                             : string;
        baseHullId                        : string;
        skinHullId                        : string;
        hullName                          : string;
        hullDesignation                   : string;
        fleetPoints                       : number;
        systemId                          : string;
        descriptionId                     : string;
        descriptionPrefix                 : string;
        restoreToBaseHull                 : string;
        tags                              : string[];
        manufacturer                      : string;
        tech                              : string;
        fighterBays                       : number;
        spriteName                        : string;
        baseValue                         : number;
        baseValueMult                     : number;
        removeBuiltInMods                 : string[];
        removeBuiltInWings                : string[];
        removeWeaponSlots                 : string[];
        removeBuiltInWeapons              : string[];
        removeEngineSlots                 : EngineSlot[]; // References unified engine slot definition
        builtInWings                      : any[];
        builtInMods                       : string[];
        builtInWeapons                    : BuiltInWeapons;
        weaponSlotChanges                 : { [key         : string]: WeaponSlotChange; };
    }
}