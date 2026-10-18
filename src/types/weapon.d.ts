export {};

declare global {
    export interface WeaponReturnData {
        weapon                            : WeaponJson;
        weapon_data                       : WeaponCSV;
        projectile                        : Projectile;
        color                             : Color;
        description                       : Description;
    }

    export enum WeaponDamageType {
        HIGH_EXPLOSIVE = "HIGH_EXPLOSIVE",
        KINETIC        = "KINETIC",
        ENERGY         = "ENERGY",
        FRAGMENTATION  = "FRAGMENTATION",
        OTHER          = "OTHER",
    }

    export interface WeaponCSV {
        name                              : string;
        id                                : string;
        "tech/manufacturer"               : string;
        range                             : string;
        "base value"                      : string;
        hints                             : string;
        tags                              : string;
        rarity                            : string;
        "number"                          : string;
        type                              : WeaponDamageType;
        tier                              : string;
        "damage/second"                   : number;
        "damage/shot"                     : number;
        emp                               : string;
        impact                            : string;
        "turn rate"                       : string;
        OPs                               : string;
        ammo                              : string;
        "ammo/sec"                        : number;
        "reload size"                     : string;
        "energy/shot"                     : number;
        "energy/second"                   : number;
        chargeup                          : number;
        chargedown                        : number;
        "burst size"                      : number;
        "burst delay"                     : number;
        "min spread"                      : string;
        "max spread"                      : string;
        "spread/shot"                     : string;
        "spread decay/sec"                : string;
        "beam speed"                      : string;
        "proj speed"                      : string;
        "launch speed"                    : string;
        "flight time"                     : string;
        "proj hitpoints"                  : string;
        autofireAccBonus                  : string;
        extraArcForAI                     : string;
        groupTag                          : string;
        "for weapon tooltip>>"            : string;
        primaryRoleStr                    : string;
        speedStr                          : string;
        trackingStr                       : string;
        turnRateStr                       : string;
        accuracyStr                       : string;
        customPrimary                     : string;
        customPrimaryHL                   : string;
        customAncillary                   : string;
        customAncillaryHL                 : string;
        noDPSInTooltip                    : string;
    }

    export interface WeaponJson {
        id                                : string;
        specClass                         : string;
        projectileSpecId                  : string;
        type                              : WeaponTypes;
        size                              : Size;
        turretSprite                      : string;
        hardpointSprite                   : string;
        turretOffsets                     : number[];
        turretAngleOffsets                : number[];
        hardpointOffsets                  : number[];
        hardpointAngleOffsets             : number[];
        barrelMode                        : string;
        animationType                     : string;
        smokeSpec                         : SmokeSpec;
        fireSoundTwo                      : string;
        owner                             : string;
        everyFrameEffect                  : string;
        restrictToSpecifiedMountType      : boolean;
        displayArcRadius                  : number;
        turretGunSprite                   : string;
        hardpointGunSprite                : string;
        visualRecoil                      : number;
        renderHints                       : string[];
        muzzleFlashSpec                   : MuzzleFlashSpec;
        turretGlowSprite                  : string;
        hardpointGlowSprite               : string;
        separateRecoilForLinkedBarrels    : boolean;
        glowColor                         : number[];
        autocharge                        : boolean;
        hitGlowRadius                     : number;
        fringeColor                       : number[];
        coreColor                         : number[];
        darkCore                          : boolean;
        width                             : number;
        textureType                       : string;
        textureScrollSpeed                : number;
        pixelsPerTexel                    : number;
        pierceSet                         : string[];
        showDamageWhenDecorative          : boolean;
        renderBelowAllWeapons             : boolean;
        numFrames                         : number;
        frameRate                         : number;
        beamEffect                        : string;
        collisionClass                    : string;
        collisionClassByFighter           : string;
        interruptibleBurst                : boolean;
        fireSoundOne                      : string;
        mountTypeOverride                 : WeaponTypes;
        specialWeaponGlowWidth            : number;
        specialWeaponGlowHeight           : number;
        useGlowColorForHitGlow            : boolean;
        hitGlowBrightenDuration           : number;
        turretUnderSprite                 : string;
        hardpointUnderSprite              : string;
        alwaysAnimate                     : string;
        skipIdleFrameIfZeroBurstDelay     : boolean;
        unaffectedByProjectileSpeedBonuses: boolean;
        requiresFullCharge                : boolean;
        beamFireOnlyOnFullCharge          : boolean;
        noImpactSounds                    : boolean;
        noShieldImpactSounds              : boolean;
        noNonShieldImpactSounds           : boolean;
        randomizeTextureOffset            : boolean;
        playFullFireSoundOne              : boolean;
        convergeOnPoint                   : boolean;
        stopPreviousFireSound             : boolean;
        coreWidthMult                     : number;
        renderAboveAllWeapons             : number;
    }
}