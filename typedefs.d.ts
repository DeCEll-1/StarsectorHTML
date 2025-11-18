export { }

declare global {

    export interface Global {
        colors       : { [key: string]: string };
        creationDate : Date;
        descriptions : Description[];
        hull_mods    : Hullmod[];
        ship_data    : ShipCSV[];
        ship_systems : System[];
        ships        : ShipJSON[];
        skins        : Skin[];
        weapon_data  : WeaponCSV[];
        weapons      : WeaponJson[];
        wing_data    : Wing[];
        projectiles  : Projectile[];
    }

    export interface ModInfo {
        id                  : string;
        name                : string;
        author              : string;
        version             : string;
        description         : string;
        gameVersion         : string;
        jars                : string[];
        modPlugin           : string;
        dependencies        : Dependency[];
        originalGameVersion : string;
        directory           : string;
    }

    export interface Dependency {
        id   : string;
        name : string;
    }

    export interface ShipReturnData {
        hullName           : string;
        hullHeader         : string;
        selectedHull       : string;
        image              : string;
        skin               : Skin;
        baseHullId         : string;
        shipJson           : ShipJSON;
        csv                : ShipCSV;
        description        : Description;
        weapons            : WeaponCSV[];
        wings              : Wing[];
        hullmods           : Hullmod[];
        system             : System;
        systemDesc         : Description;
        color              : Color;
        right_click_system : System;
    }

    export interface WeaponReturnData {
        weapon      : WeaponJson;
        weapon_data : WeaponCSV;
        projectile  : Projectile;
        color       : Color;
        description : Description;
    }

    export interface Color {
        type : string;
        hex  : string;
    }

    export interface ShipCSV {
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
        builtInWeapons  : BuiltInWeapons;
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
        Ballistic  = "BALLISTIC",
        Missile    = "MISSILE",
        Energy     = "ENERGY",
        Hybrid     = "HYBRID",
        Composite  = "COMPOSITE",
        Synergy    = "SYNERGY",
        Universal  = "UNIVERSAL",
        BuiltIn    = "BUILT_IN",
        Decorative = "DECORATIVE",
        System     = "SYSTEM",
    }

    export enum Size {
        Large  = "LARGE",
        Medium = "MEDIUM",
        Small  = "SMALL",
    }

    export enum Categories {
        None     = "None",
        Ships    = "Ships",
        Stations = "Stations",
        Weapons  = "Weapons",
    }

    export enum LocalStorageKeys {
        global_sources         = "global_sources",
        last_item_searched     = "last_item_searched",
        last_searched_item     = "last_searched_item",
        last_selected_category = "last_selected_category",
        last_mod_selected      = "last_mod_selected",
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
        restoreToBaseHull    : string;
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

    export enum WeaponDamageType {
        HIGH_EXPLOSIVE = "HIGH_EXPLOSIVE",
        KINETIC        = "KINETIC",
        ENERGY         = "ENERGY",
        FRAGMENTATION  = "FRAGMENTATION",
        OTHER          = "OTHER",
    }

    export interface WeaponCSV {
        name                   : string;
        id                     : string;
        "tech/manufacturer"    : string;
        range                  : string;
        "base value"           : string;
        hints                  : string;
        tags                   : string;
        rarity                 : string;
        "number"               : string;
        type                   : WeaponDamageType;
        tier                   : string;
        "damage/second"        : number;
        "damage/shot"          : number;
        emp                    : string;
        impact                 : string;
        "turn rate"            : string;
        OPs                    : string;
        ammo                   : string;
        "ammo/sec"             : number;
        "reload size"          : string;
        "energy/shot"          : number;
        "energy/second"        : number;
        chargeup               : number;
        chargedown             : number;
        "burst size"           : number;
        "burst delay"          : number;
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

    export interface WeaponJson {
        id                                 : string;
        specClass                          : string;
        projectileSpecId                   : string;
        type                               : WeaponTypes;
        size                               : Size;
        turretSprite                       : string;
        hardpointSprite                    : string;
        turretOffsets                      : number[];
        turretAngleOffsets                 : number[];
        hardpointOffsets                   : number[];
        hardpointAngleOffsets              : number[];
        barrelMode                         : string;
        animationType                      : string;
        smokeSpec                          : SmokeSpec;
        fireSoundTwo                       : string;
        owner                              : string;
        everyFrameEffect                   : string;
        restrictToSpecifiedMountType       : boolean;
        displayArcRadius                   : number;
        turretGunSprite                    : string;
        hardpointGunSprite                 : string;
        visualRecoil                       : number;
        renderHints                        : string[];
        muzzleFlashSpec                    : MuzzleFlashSpec;
        turretGlowSprite                   : string;
        hardpointGlowSprite                : string;
        separateRecoilForLinkedBarrels     : boolean;
        glowColor                          : number[];
        autocharge                         : boolean;
        hitGlowRadius                      : number;
        fringeColor                        : number[];
        coreColor                          : number[];
        darkCore                           : boolean;
        width                              : number;
        textureType                        : string;
        textureScrollSpeed                 : number;
        pixelsPerTexel                     : number;
        pierceSet                          : string[];
        showDamageWhenDecorative           : boolean;
        renderBelowAllWeapons              : boolean;
        numFrames                          : number;
        frameRate                          : number;
        beamEffect                         : string;
        collisionClass                     : string;
        collisionClassByFighter            : string;
        interruptibleBurst                 : boolean;
        fireSoundOne                       : string;
        mountTypeOverride                  : WeaponTypes;
        specialWeaponGlowWidth             : number;
        specialWeaponGlowHeight            : number;
        useGlowColorForHitGlow             : boolean;
        hitGlowBrightenDuration            : number;
        turretUnderSprite                  : string;
        hardpointUnderSprite               : string;
        alwaysAnimate                      : string;
        skipIdleFrameIfZeroBurstDelay      : boolean;
        unaffectedByProjectileSpeedBonuses : boolean;
        requiresFullCharge                 : boolean;
        beamFireOnlyOnFullCharge           : boolean;
        noImpactSounds                     : boolean;
        noShieldImpactSounds               : boolean;
        noNonShieldImpactSounds            : boolean;
        randomizeTextureOffset             : boolean;
        playFullFireSoundOne               : boolean;
        convergeOnPoint                    : boolean;
        stopPreviousFireSound              : boolean;
        coreWidthMult                      : number;
        renderAboveAllWeapons              : number;
    }


    export interface MuzzleFlashSpec {
        length            : number;
        spread            : number;
        particleSizeMin   : number;
        particleSizeRange : number;
        particleDuration  : number;
        particleCount     : number;
        particleColor     : number[];
    }

    export interface SmokeSpec {
        particleSizeMin       : number;
        particleSizeRange     : number;
        cloudParticleCount    : number;
        cloudDuration         : number;
        cloudRadius           : number;
        blowbackParticleCount : number;
        blowbackDuration      : number;
        blowbackLength        : number;
        blowbackSpread        : number;
        particleColor         : number[];
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

    export interface EL {
        "codex"                       : HTMLElement;
        "item_view"                   : HTMLElement;
        "main_div"                    : HTMLElement;
        "ship_name_header"            : HTMLElement;
        "image"                       : HTMLImageElement;
        "cr_deployment"               : HTMLElement;
        "recovery_rate"               : HTMLElement;
        "recovery_cost"               : HTMLElement;
        "deployment_points"           : HTMLElement;
        "peak_performance_time"       : HTMLElement;
        "crew_complement"             : HTMLElement;
        "hull_size"                   : HTMLElement;
        "ordnance_points"             : HTMLElement;
        "supplies_month"              : HTMLElement;
        "cargo_cap"                   : HTMLElement;
        "crew_cap"                    : HTMLElement;
        "crew_min"                    : HTMLElement;
        "fuel_cap"                    : HTMLElement;
        "burn_max"                    : HTMLElement;
        "fuel_cost"                   : HTMLElement;
        "sensor_profile"              : HTMLElement;
        "sensor_strength"             : HTMLElement;
        "hull_integrity"              : HTMLElement;
        "armor_rating"                : HTMLElement;
        "defense_type"                : HTMLElement;
        "defense_property_1_name"     : HTMLElement;
        "defense_property_1_val"      : HTMLElement;
        "defense_property_2_name"     : HTMLElement;
        "defense_property_2_val"      : HTMLElement;
        "defense_property_3_name"     : HTMLElement;
        "defense_property_3_val"      : HTMLElement;
        "flux_cap"                    : HTMLElement;
        "flux_diss"                   : HTMLElement;
        "speed_max"                   : HTMLElement;
        "system_title"                : HTMLElement;
        "system_description"          : HTMLElement;
        "mounts_list"                 : HTMLElement;
        "armaments_list"              : HTMLElement;
        "hullmods_list"               : HTMLElement;
        "mod_list"                    : HTMLElement;
        "search_bar_mod_list_ul"      : HTMLElement;
        "design_type"                 : HTMLElement;
        "description"                 : HTMLElement;
        "price"                       : HTMLElement;
        "related_entries"             : HTMLElement;
        "toaster"                     : HTMLElement;
        "toaster_image"               : HTMLImageElement;
        "toaster_title"               : HTMLElement;
        "toaster_text"                : HTMLElement;
        "search_bar_text_box"         : HTMLElement;
        "search_bar_list_ul"          : HTMLElement;
        "search_bar"                  : HTMLElement;
        "search_list_container"       : HTMLElement;
        "primary_role"                : HTMLElement;
        "mount_type"                  : HTMLElement;
        "stat_modifier_specification" : HTMLElement;
        "op_cost"                     : HTMLElement;
        "range"                       : HTMLElement;
        "damage"                      : HTMLElement;
        "damage_second"               : HTMLElement;
        "emp_damage"                  : HTMLElement;
        "flux_second"                 : HTMLElement;
        "flux_shot"                   : HTMLElement;
        "flux_non_emp_damage"         : HTMLElement;
        "damage_type"                 : HTMLElement;
        "tracking"                    : HTMLElement;
        "turn"                        : HTMLElement;
        "speed"                       : HTMLElement;
        "accuracy"                    : HTMLElement;
        "seconds_reload"              : HTMLElement;
        "max_ammo"                    : HTMLElement;
        "reload_size"                 : HTMLElement;
        "refire_delay"                : HTMLElement;
        "customPrimary"               : HTMLElement;
        "customAncillary"             : HTMLElement;
        "hitpoints"                   : HTMLElement;
        "max_ammo_name"               : HTMLElement;
        "seconds_reload_name"         : HTMLElement;
        "reload_size_name"            : HTMLElement;
        "no_recharge_ammo_display"    : HTMLElement;
        "type_image"                  : HTMLImageElement;
        "burst_size"                  : HTMLElement;
        "stats_container"             : HTMLElement;
    }

    export enum ProjectileSpecClass {
        projectile = "projectile",
        missile    = "missile"
    }

    export interface Projectile {
        id                                   : string;
        specClass                            : ProjectileSpecClass;
        spawnType                            : string;
        collisionClass                       : string;
        collisionClassByFighter              : string;
        length                               : number;
        hitGlowRadius                        : number;
        width                                : number;
        fadeTime                             : number;
        fringeColor                          : number[];
        coreColor                            : number[];
        textureScrollSpeed                   : number;
        pixelsPerTexel                       : number;
        bulletSprite                         : string;
        owner                                : string;
        behaviorSpec                         : BehaviorSpec;
        onHitEffect                          : string;
        textureType                          : string;
        passThroughMissiles                  : boolean;
        passThroughFighters                  : boolean;
        passThroughFightersOnlyWhenDestroyed : boolean;
        missileType                          : string;
        sprite                               : string;
        size                                 : number[];
        center                               : number[];
        collisionRadius                      : number;
        explosionColor                       : number[];
        explosionRadius                      : number;
        explosionSpec                        : ExplosionSpec;
        flameoutTime                         : number;
        armingTime                           : number;
        noEngineGlowTime                     : number;
        engineSpec                           : EngineSpec;
        engineSlots                          : EngineSlot[];
        onFireEffect                         : string;
        destroyedExplosionColor              : number[];
        useHitGlowWhenDestroyed              : boolean;
        glowColor                            : number[];
        glowRadius                           : number;
        reduceDamageWhileFading              : boolean;
        fizzleOnReachingWeaponRange          : boolean;
        dudProbabilityOnFlameout             : number;
        maxFlightTime                        : number;
        alwaysAccelerate                     : boolean;
        glowSprite                           : string;
        applyOnHitEffectWhenPassThrough      : boolean;
        noCollisionWhileFading               : boolean;
        useHitGlowWhenDealingDamage          : boolean;
        renderTargetIndicator                : boolean;
        collisionClassAfterFlameout          : string;
        coreWidthMult                        : number;
    }

    export interface BehaviorSpec {
        behavior         : string;
        splitRange       : number;
        splitRangeRange  : number;
        minTimeToSplit   : number;
        canSplitEarly    : boolean;
        splitSound       : string;
        numShots         : number;
        damage           : number;
        emp              : number;
        damageType       : string;
        hitpoints        : number;
        evenSpread       : boolean;
        arc              : number;
        spreadInaccuracy : number;
        spreadSpeed      : number;
        spreadSpeedRange : number;
        projectileRange  : number;
        projectileSpec   : string;
        smokeSpec        : SmokeSpec;
    }

    export interface SmokeSpec {
        particleSizeMin       : number;
        particleSizeRange     : number;
        cloudParticleCount    : number;
        cloudDuration         : number;
        cloudRadius           : number;
        blowbackParticleCount : number;
        blowbackDuration      : number;
        blowbackLength        : number;
        blowbackSpread        : number;
        particleColor         : number[];
    }

    export interface EngineSlot {
        id        : string;
        loc       : number[];
        style     : string;
        styleSpec : StyleSpec;
        width     : number;
        length    : number;
        angle     : number;
    }

    export interface StyleSpec {
        mode                            : string;
        engineColor                     : number[];
        glowSizeMult                    : number;
        contrailDuration                : number;
        contrailWidthMult               : number;
        contrailWidthAddedFractionAtEnd : number;
        contrailMinSeg                  : number;
        contrailMaxSpeedMult            : number;
        contrailAngularVelocityMult     : number;
        contrailSpawnDistMult           : number;
        contrailColor                   : number[];
        type                            : string;
    }

    export interface EngineSpec {
        turnAcc  : number;
        turnRate : number;
        acc      : number;
        dec      : number;
    }

    export interface ExplosionSpec {
        duration                : number;
        radius                  : number;
        coreRadius              : number;
        collisionClass          : string;
        collisionClassByFighter : string;
    }

}