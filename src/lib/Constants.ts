const REPO_NAME = "StarsectorHTML";

const getBasePath = (): string => {
  if (typeof window === "undefined") return `/${REPO_NAME}`;
  return window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost" 
    ? ""
    : `/${REPO_NAME}`;
};

export const BASE_PATH = getBasePath();
export const CODEX_ICON_FOLDER_PATH = `${BASE_PATH}/Images/Codex`;

// Codex Icons
export const CODEX_ICON_ABILITIES = `${CODEX_ICON_FOLDER_PATH}/abilities.png`;
export const CODEX_ICON_COMMODITIES = `${CODEX_ICON_FOLDER_PATH}/commodities.png`;
export const CODEX_ICON_CUSTOM = `${CODEX_ICON_FOLDER_PATH}/custom.png`;
export const CODEX_ICON_FIGHTERS = `${CODEX_ICON_FOLDER_PATH}/fighters.png`;
export const CODEX_ICON_GALLERY = `${CODEX_ICON_FOLDER_PATH}/gallery.png`;
export const CODEX_ICON_GAME_MECHANICS = `${CODEX_ICON_FOLDER_PATH}/game_mechanics.png`;
export const CODEX_ICON_HULLMODS = `${CODEX_ICON_FOLDER_PATH}/hullmods.png`;
export const CODEX_ICON_INDUSTRIES = `${CODEX_ICON_FOLDER_PATH}/industries.png`;
export const CODEX_ICON_MANUAL_ARMOR = `${CODEX_ICON_FOLDER_PATH}/manual_armor.png`;
export const CODEX_ICON_MANUAL_BALLISTIC_WEAPONS = `${CODEX_ICON_FOLDER_PATH}/manual_ballistic_weapons.png`;
export const CODEX_ICON_MANUAL_COMBAT = `${CODEX_ICON_FOLDER_PATH}/manual_combat.png`;
export const CODEX_ICON_MANUAL_ENERGY_WEAPONS = `${CODEX_ICON_FOLDER_PATH}/manual_energy_weapons.png`;
export const CODEX_ICON_MANUAL_FLUX = `${CODEX_ICON_FOLDER_PATH}/manual_flux.png`;
export const CODEX_ICON_MANUAL_MISSILES = `${CODEX_ICON_FOLDER_PATH}/manual_missiles.png`;
export const CODEX_ICON_MANUAL_OTHER = `${CODEX_ICON_FOLDER_PATH}/manual_other.png`;
export const CODEX_ICON_MANUAL_SHIELDS = `${CODEX_ICON_FOLDER_PATH}/manual_shields.png`;
export const CODEX_ICON_MANUAL_TRIPAD = `${CODEX_ICON_FOLDER_PATH}/manual_tripad.png`;
export const CODEX_ICON_MANUAL_UI = `${CODEX_ICON_FOLDER_PATH}/manual_ui.png`;
export const CODEX_ICON_MANUAL_UI2 = `${CODEX_ICON_FOLDER_PATH}/manual_ui2.png`;
export const CODEX_ICON_MANUAL_VENTING = `${CODEX_ICON_FOLDER_PATH}/manual_venting.png`;
export const CODEX_ICON_MARKET_CONDITIONS = `${CODEX_ICON_FOLDER_PATH}/market_conditions.png`;
export const CODEX_ICON_SHIPS = `${CODEX_ICON_FOLDER_PATH}/ships.png`;
export const CODEX_ICON_SHIP_SYSTEMS = `${CODEX_ICON_FOLDER_PATH}/ship_systems.png`;
export const CODEX_ICON_SKILLS = `${CODEX_ICON_FOLDER_PATH}/skills.png`;
export const CODEX_ICON_SPACERS_MANUAL = `${CODEX_ICON_FOLDER_PATH}/spacers_manual.png`;
export const CODEX_ICON_SPECIAL_ITEMS = `${CODEX_ICON_FOLDER_PATH}/special_items.png`;
export const CODEX_ICON_STARS_PLANETS = `${CODEX_ICON_FOLDER_PATH}/stars_planets.png`;
export const CODEX_ICON_STATIONS = `${CODEX_ICON_FOLDER_PATH}/stations.png`;
export const CODEX_ICON_WEAPONS = `${CODEX_ICON_FOLDER_PATH}/weapons.png`;

// General & Weapon Icons
export const ICON_FOLDER_PATH = `${BASE_PATH}/Images/Icons`;
export const ICON_QUESTION_MARK = `${ICON_FOLDER_PATH}/question_mark.png`;
export const ICON_ERROR_PATH = `${ICON_FOLDER_PATH}/alert.png`;
export const ICON_DOWNLOAD_PATH = `${ICON_FOLDER_PATH}/download.png`;
export const ICON_INFO_PATH = `${ICON_FOLDER_PATH}/info.png`;
export const ICON_CODEX_ARROW_UP = `${ICON_FOLDER_PATH}/arrow_up.png`;
export const ICON_SHARE = `${ICON_FOLDER_PATH}/share.png`;
export const ICON_CHECK = `${ICON_FOLDER_PATH}/check.png`;

export const ICON_DAMAGE_TYPE_ENERGY = `${ICON_FOLDER_PATH}/damagetype_energy.png`;
export const ICON_DAMAGE_TYPE_FRAGMENTATION = `${ICON_FOLDER_PATH}/damagetype_fragmentation.png`;
export const ICON_DAMAGE_TYPE_HIGH_EXPLOSIVE = `${ICON_FOLDER_PATH}/damagetype_high_explosive.png`;
export const ICON_DAMAGE_TYPE_KINETIC = `${ICON_FOLDER_PATH}/damagetype_kinetic.png`;
export const ICON_DAMAGE_TYPE_OTHER = `${ICON_FOLDER_PATH}/damagetype_other.png`;