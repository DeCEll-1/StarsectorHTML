export { };

declare global {
    export interface Global {
        colors                 : { [key: string]: string; };
        creationDate           : Date;
        descriptions           : Description[];
        hull_mods              : Hullmod[];
        ship_data              : ShipCSV[];
        ship_systems           : System[];
        ships                  : ShipJSON[];
        skins                  : Skin[];
        weapon_data            : WeaponCSV[];
        weapons                : WeaponJson[];
        wing_data              : Wing[];
        projectiles            : Projectile[];
        mods                   : ModInfo[];
        variants               : Variant[];
    }
}