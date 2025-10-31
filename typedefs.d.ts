export { }

declare global {

    export interface ship_data {
        selectedHull : string;
        image        : string;
        skin         : Skin;
        baseHullId   : string;
        shipJson     : ShipJSON;
        csv          : CSV;
        description  : Description;
        weapons      : Weapon[];
        wings        : Wing[];
        hullmods     : Hullmod[];
        system       : System;
        systemDesc   : Description;
        color        : Color;
    }

    export interface Color {
        type : string;
        hex  : string;
    }

    export interface CSV {
        name                   : string;
        id                     : string;
        designation            : string;
        "tech/manufacturer"    : string;
        "system id"            : string;
        "fleet pts"            : string;
        hitpoints              : string;
        "armor rating"         : string;
        "max flux"             : string;
        "8/6/5/4%"             : string;
        "flux dissipation"     : string;
        "ordnance points"      : string;
        "fighter bays"         : string;
        "max speed"            : string;
        acceleration           : string;
        deceleration           : string;
        "max turn rate"        : string;
        "turn acceleration"    : string;
        mass                   : string;
        "shield type"          : string;
        "defense id"           : string;
        "shield arc"           : string;
        "shield upkeep"        : string;
        "shield efficiency"    : string;
        "phase cost"           : string;
        "phase upkeep"         : string;
        "min crew"             : string;
        "max crew"             : string;
        cargo                  : string;
        fuel                   : string;
        "fuel/ly"              : string;
        range                  : string;
        "max burn"             : string;
        "base value"           : string;
        "cr %/day"             : string;
        "CR to deploy"         : string;
        "peak CR sec"          : string;
        "CR loss/sec"          : string;
        "supplies/rec"         : string;
        "supplies/mo"          : string;
        "c/s"                  : string;
        "c/f"                  : string;
        "f/s"                  : string;
        "f/f"                  : string;
        "crew/s"               : string;
        "crew/f"               : string;
        hints                  : string;
        tags                   : string;
        "logistics n/a reason" : string;
        "codex variant id"     : string;
        rarity                 : string;
        breakProb              : string;
        minPieces              : string;
        maxPieces              : string;
        "travel drive"         : string;
        "number"               : string;
    }

    export interface Description {
        id    : string;
        type  : string;
        text1 : string;
        text2 : string;
        text3 : string;
        text4 : string;
        text5 : string;
        notes : string;
    }

    export interface Hullmod {
        name                : string;
        id                  : string;
        "tech/manufacturer" : string;
        "base value"        : string;
        tags                : string;
        rarity              : string;
        tier                : string;
        uiTags              : string;
        unlocked            : string;
        hidden              : string;
        hiddenEverywhere    : string;
        cost_frigate        : string;
        cost_dest           : string;
        cost_cruiser        : string;
        cost_capital        : string;
        script              : string;
        desc                : string;
        short               : string;
        sModDesc            : string;
        sprite              : string;
    }

    export interface ShipJSON {
        bounds          : number[];
        builtInWeapons  : string[];
        builtInMods     : string[];
        builtInWings    : string[];
        center          : number[];
        collisionRadius : number;
        owner           : string;
        coversColor     : string;
        engineSlots     : EngineSlot[];
        height          : number;
        hullId          : string;
        hullName        : string;
        hullSize        : string;
        shieldCenter    : number[];
        shieldRadius    : number;
        spriteName      : string;
        style           : string;
        viewOffset      : number;
        weaponSlots     : WeaponSlot[];
        width           : number;
    }

    export interface EngineSlot {
        angle        : number;
        contrailSize : number;
        length       : number;
        location     : number[];
        style        : string;
        width        : number;
    }

    export interface WeaponSlot {
        angle     : number;
        arc       : number;
        id        : string;
        locations : number[];
        mount     : Mount;
        size      : Size;
        type      : WeaponTypes;
    }

    export enum Mount {
        Hardpoint = "HARDPOINT",
        Hidden    = "HIDDEN",
        Turret    = "TURRET",
    }

    export enum WeaponTypes {
        Ballistic = "BALLISTIC",
        Energy    = "ENERGY",
        Missile   = "MISSILE",
        Hybrid    = "HYBRID",
        Composite = "COMPOSITE",
        Synergy   = "SYNERGY",
        Universal = "UNIVERSAL",
    }

    export enum Size {
        Large  = "LARGE",
        Medium = "MEDIUM",
        Small  = "SMALL",
    }

    export interface Skin {
        owner                : string;
        baseHullId           : string;
        skinHullId           : string;
        hullName             : string;
        hullDesignation      : string;
        fleetPoints          : number;
        systemId             : string;
        descriptionId        : string;
        descriptionPrefix    : string;
        tags                 : string[];
        manufacturer         : string;
        tech                 : string;
        fighterBays          : number;
        spriteName           : string;
        baseValueMult        : number;
        removeBuiltInMods    : string[];
        removeBuiltInWings   : string[];
        removeWeaponSlots    : string[];
        removeBuiltInWeapons : string[];
        removeEngineSlots    : EngineSlot[];
        builtInWings         : any[];
        builtInMods          : string[];
        builtInWeapons       : BuiltInWeapons;
        weaponSlotChanges    : { [key: string]: WeaponSlotChange };
    }

    export interface BuiltInWeapons {
        [slotId: string] : string;
    }

    export interface WeaponSlotChange {
        type : string;
    }

    export interface System {
        name              : string;
        id                : string;
        tags              : string;
        "flux/second"     : string;
        "f/s (base rate)" : string;
        "f/s (base cap)"  : string;
        "flux/use"        : string;
        "f/u (base rate)" : string;
        "f/u (base cap)"  : string;
        "cr/u"            : string;
        "max uses"        : string;
        regen             : string;
        "charge up"       : string;
        active            : string;
        down              : string;
        cooldown          : string;
        toggle            : string;
        noDissipation     : string;
        noHardDissipation : string;
        hardFlux          : string;
        noFiring          : string;
        noTurning         : string;
        noStrafing        : string;
        noAccel           : string;
        noShield          : string;
        noVent            : string;
        isPhaseCloak      : string;
        icon              : string;
    }

    export interface Weapon {
        name                   : string;
        id                     : string;
        "tech/manufacturer"    : string;
        range                  : string;
        "base value"           : string;
        hints                  : string;
        tags                   : string;
        rarity                 : string;
        "number"               : string;
        type                   : string;
        tier                   : string;
        "damage/second"        : string;
        "damage/shot"          : string;
        emp                    : string;
        impact                 : string;
        "turn rate"            : string;
        OPs                    : string;
        ammo                   : string;
        "ammo/sec"             : string;
        "reload size"          : string;
        "energy/shot"          : string;
        "energy/second"        : string;
        chargeup               : string;
        chargedown             : string;
        "burst size"           : string;
        "burst delay"          : string;
        "min spread"           : string;
        "max spread"           : string;
        "spread/shot"          : string;
        "spread decay/sec"     : string;
        "beam speed"           : string;
        "proj speed"           : string;
        "launch speed"         : string;
        "flight time"          : string;
        "proj hitpoints"       : string;
        autofireAccBonus       : string;
        extraArcForAI          : string;
        groupTag               : string;
        "for weapon tooltip>>" : string;
        primaryRoleStr         : string;
        speedStr               : string;
        trackingStr            : string;
        turnRateStr            : string;
        accuracyStr            : string;
        customPrimary          : string;
        customPrimaryHL        : string;
        customAncillary        : string;
        customAncillaryHL      : string;
        noDPSInTooltip         : string;
    }

    export interface Wing {
        name                      : string;
        id                        : string;
        designation               : string;
        "tech/manufacturer"       : string;
        "system id"               : string;
        "fleet pts"               : string;
        hitpoints                 : string;
        "armor rating"            : string;
        "max flux"                : string;
        "8/6/5/4%"                : string;
        "flux dissipation"        : string;
        "ordnance points"         : string;
        "fighter bays"            : string;
        "max speed"               : string;
        acceleration              : string;
        deceleration              : string;
        "max turn rate"           : string;
        "turn acceleration"       : string;
        mass                      : string;
        "shield type"             : string;
        "defense id"              : string;
        "shield arc"              : string;
        "shield upkeep"           : string;
        "shield efficiency"       : string;
        "phase cost"              : string;
        "phase upkeep"            : string;
        "min crew"                : string;
        "max crew"                : string;
        cargo                     : string;
        fuel                      : string;
        "fuel/ly"                 : string;
        range                     : string;
        "max burn"                : string;
        "base value"              : string;
        "cr %/day"                : string;
        "CR to deploy"            : string;
        "peak CR sec"             : string;
        "CR loss/sec"             : string;
        "supplies/rec"            : string;
        "supplies/mo"             : string;
        "c/s"                     : string;
        "c/f"                     : string;
        "f/s"                     : string;
        "f/f"                     : string;
        "crew/s"                  : string;
        "crew/f"                  : string;
        hints                     : string;
        tags                      : string;
        "logistics n/a reason"    : string;
        "codex variant id"        : string;
        rarity                    : string;
        breakProb                 : string;
        minPieces                 : string;
        maxPieces                 : string;
        "travel drive"            : string;
        "number"                  : string;
        tier                      : string;
        variant                   : string;
        "op cost"                 : string;
        formation                 : string;
        attackRunRange            : string;
        attackPositionOffset      : string;
        num                       : string;
        role                      : string;
        "role desc"               : string;
        refit                     : string;
        variant_no_classification : string;
    }
}