//#region global vars

// get this file from: https://www.npmjs.com/package/simplebar?activeTab=code
/// <reference path="./Resources/libs/SimpleBar/simplebar.js" />

// @ts-ignore
const REPO_NAME = "StarsectorHTML";
// @ts-ignore
const BASE_PATH = location.hostname === "127.0.0.1" ? "." : `/${REPO_NAME}`;
const CODEX_ICON_FOLDER_PATH = `${BASE_PATH}/Resources/Images/Codex`
const { } = "------------CODEX------------";
const CODEX_ICON_ABILITIES = `${CODEX_ICON_FOLDER_PATH}/abilities.png`
const CODEX_ICON_COMMODITIES = `${CODEX_ICON_FOLDER_PATH}/commodities.png`
const CODEX_ICON_CUSTOM = `${CODEX_ICON_FOLDER_PATH}/custom.png`
const CODEX_ICON_FIGHTERS = `${CODEX_ICON_FOLDER_PATH}/fighters.png`
const CODEX_ICON_GALLERY = `${CODEX_ICON_FOLDER_PATH}/gallery.png`
const CODEX_ICON_GAME_MECHANICS = `${CODEX_ICON_FOLDER_PATH}/game_mechanics.png`
const CODEX_ICON_HULLMODS = `${CODEX_ICON_FOLDER_PATH}/hullmods.png`
const CODEX_ICON_INDUSTRIES = `${CODEX_ICON_FOLDER_PATH}/industries.png`
const CODEX_ICON_MANUAL_ARMOR = `${CODEX_ICON_FOLDER_PATH}/manual_armor.png`
const CODEX_ICON_MANUAL_BALLISTIC_WEAPONS = `${CODEX_ICON_FOLDER_PATH}/manual_ballistic_weapons.png`
const CODEX_ICON_MANUAL_COMBAT = `${CODEX_ICON_FOLDER_PATH}/manual_combat.png`
const CODEX_ICON_MANUAL_ENERGY_WEAPONS = `${CODEX_ICON_FOLDER_PATH}/manual_energy_weapons.png`
const CODEX_ICON_MANUAL_FLUX = `${CODEX_ICON_FOLDER_PATH}/manual_flux.png`
const CODEX_ICON_MANUAL_MISSILES = `${CODEX_ICON_FOLDER_PATH}/manual_missiles.png`
const CODEX_ICON_MANUAL_OTHER = `${CODEX_ICON_FOLDER_PATH}/manual_other.png`
const CODEX_ICON_MANUAL_SHIELDS = `${CODEX_ICON_FOLDER_PATH}/manual_shields.png`
const CODEX_ICON_MANUAL_TRIPAD = `${CODEX_ICON_FOLDER_PATH}/manual_tripad.png`
const CODEX_ICON_MANUAL_UI = `${CODEX_ICON_FOLDER_PATH}/manual_ui.png`
const CODEX_ICON_MANUAL_UI2 = `${CODEX_ICON_FOLDER_PATH}/manual_ui2.png`
const CODEX_ICON_MANUAL_VENTING = `${CODEX_ICON_FOLDER_PATH}/manual_venting.png`
const CODEX_ICON_MARKET_CONDITIONS = `${CODEX_ICON_FOLDER_PATH}/market_conditions.png`
const CODEX_ICON_SHIPS = `${CODEX_ICON_FOLDER_PATH}/ships.png`
const CODEX_ICON_SHIP_SYSTEMS = `${CODEX_ICON_FOLDER_PATH}/ship_systems.png`
const CODEX_ICON_SKILLS = `${CODEX_ICON_FOLDER_PATH}/skills.png`
const CODEX_ICON_SPACERS_MANUAL = `${CODEX_ICON_FOLDER_PATH}/spacers_manual.png`
const CODEX_ICON_SPECIAL_ITEMS = `${CODEX_ICON_FOLDER_PATH}/special_items.png`
const CODEX_ICON_STARS_PLANETS = `${CODEX_ICON_FOLDER_PATH}/stars_planets.png`
const CODEX_ICON_STATIONS = `${CODEX_ICON_FOLDER_PATH}/stations.png`
const CODEX_ICON_WEAPONS = `${CODEX_ICON_FOLDER_PATH}/weapons.png`
const { } = "------------ICONS------------";
const ICON_FOLDER_PATH = `${BASE_PATH}/Resources/Images/Icons`
const ICON_ERROR_PATH = `${ICON_FOLDER_PATH}/alert.png`
const ICON_DOWNLOAD_PATH = `${ICON_FOLDER_PATH}/download.png`
const ICON_INFO_PATH = `${ICON_FOLDER_PATH}/info.png`
const ICON_CODEX_ARROW_UP = `${ICON_FOLDER_PATH}/arrow_up.png`

// @ts-ignore
let globalSources;
let currentSelectedModId
let mod_info;


//#endregion

//#region elements
// @ts-ignore
const EL = (() => {
    const ids = [
        // containers
        "codex", "item_view", "main_div",
        // header
        "ship_name_header", "ship_image",
        // combat
        "cr_deployment", "recovery_rate", "recovery_cost", "deployment_points",
        "peak_performance_time", "crew_complement", "hull_size", "ordnance_points",
        "supplies_month", "cargo_cap", "crew_cap", "crew_min", "fuel_cap",
        "burn_max", "fuel_cost", "sensor_profile", "sensor_strength",
        // defense
        "hull_integrity", "armor_rating", "defense_type",
        "defense_property_1_name", "defense_property_1_val",
        "defense_property_2_name", "defense_property_2_val",
        "defense_property_3_name", "defense_property_3_val",
        // flux / speed
        "flux_cap", "flux_diss", "speed_max",
        // system
        "system_title", "system_description",
        // lists
        "mounts_list", "armaments_list", "hullmods_list",
        "mod_list", "search_bar_mod_list_ul",
        // misc
        "design_type", "ship_description", "ship_price", "related_entries",
        // toaster
        "toaster", "toaster_image", "toaster_title", "toaster_text",
        // search
        "search_bar_text_box", "search_bar_list_ul", "search_bar", "search_list_container"
    ];
    return Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
})();
//#endregion

//#region helper functions

function capitalize(s) { return ((s[0] ?? "NULL").toUpperCase() + (s ?? "NULL").slice(1).toLowerCase()).replace("_", " "); }
function setValue(el, val, suffix = '') { return el.textContent = (val == null) ? '—' : val + suffix; }
function make(html, tag = 'div') { const el = document.createElement(tag); el.innerHTML = html; return el; };
function firstNonEmpty(...vals) {
    const retVal = vals.find(v => v != null && v !== "")
    if (retVal)
        return retVal

    return "Unknown";
}
function imageExists(url, callback) {
    const img = new Image();

    img.onload = function () {
        callback(true);
    };

    img.onerror = function () {
        callback(false);
    };

    img.src = url; // Triggers loading
}

function getShipSkinImagePath(ship, skin) {
    return `${BASE_PATH}/Resources/GameSources/mods/${globalSources[firstNonEmpty(skin?.owner, ship?.owner)].directory}/` + (firstNonEmpty(skin?.spriteName, ship?.spriteName));
}

function getShipOwnedSkinImagePath(ship, skin) {
    return `${BASE_PATH}/Resources/GameSources/mods/${globalSources[ship.owner].directory}/` + (firstNonEmpty(skin?.spriteName, ship?.spriteName));
}

/**
 * @param {HTMLImageElement} img
 * @param {{ ship?: ShipJSON; base?: ShipJSON; skin?: Skin }} c
 */
function updateImgShipSource(img, c) {
    img.src = getShipSkinImagePath(c.ship ?? c.base, c.skin)
    img.onerror = function () {
        img.src = getShipOwnedSkinImagePath(c.ship ?? c.base, c.skin)
    }
}

function substringLevenshtein(hay, needle) {
    hay = hay.toLowerCase(); needle = needle.toLowerCase();
    if (hay.includes(needle)) return 0;
    if (needle.length > hay.length) return levenshtein(hay, needle);
    let min = Infinity;
    for (let i = 0; i <= hay.length - needle.length; i++) {
        min = Math.min(min, levenshtein(hay.slice(i, i + needle.length), needle));
    }
    return min;
};

function levenshtein(a, b) {
    const m = Array.from({ length: b.length + 1 }, () => []);
    for (let i = 0; i <= b.length; i++) m[i][0] = i;
    for (let j = 0; j <= a.length; j++) m[0][j] = j;
    for (let i = 1; i <= b.length; i++)
        for (let j = 1; j <= a.length; j++)
            m[i][j] = a[j - 1] === b[i - 1] ? m[i - 1][j - 1]
                : Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]) + 1;
    return m[b.length][a.length];
}

function mergeByProperty(left, right, leftPropertyName, rightPropertyName) {
    const leftIDToObject = new Map(left.map(s => [s[leftPropertyName], s]))
    return right.map(
        r => {
            const l = leftIDToObject.get(r?.[rightPropertyName])
            return l ? { ...l, ...r } : null;
        }
    ).filter(Boolean)
}

//#endregion

//#region load

load();
function load() {

    useCachedSources();
    checkForNewSources(); // check and update the source lazly
    setTimeout(() => runMain(), 50); // a lil bit of delay so it doesnt explode
}

function runMain() {
    if (globalSources)
        setTimeout(() => main(), 10);
    else
        setTimeout(() => runMain(), 100);
}

async function checkForNewSources() {
    try {
        const updateTimeURL = "https://raw.githubusercontent.com/DeCEll-1/StarsectorHTML/refs/heads/main/Resources/GameSources/mods/creation_date.txt";

        const latestSourceDate = new Date(
            (await (await fetch(updateTimeURL)).text()).match(/(.*\.\d{3})/g)[0] + "Z"
        )
        const currentDate = new Date(globalSources?.creationDate || 0);
        if (currentDate >= latestSourceDate)
            return;

        // latest source is younger

        showToaster("Updating...", "Updating the data from latest source.", { img: ICON_DOWNLOAD_PATH })

        await Promise.all([
            fetch(`${BASE_PATH}/Resources/GameSources/mods/merged_game_sources.json`).then(r => r.json())
        ]).then(([data]) => { globalSources = data; })

        localStorage.setItem(LocalStorageKeys.global_sources, JSON.stringify(globalSources));

    } catch (err) {
        showToaster("Error", "Failed to check or update resources, check logs for more details.", { img: ICON_ERROR_PATH })
        console.error(err);
    }

}

function useCachedSources() {
    try {
        if (localStorage.getItem(LocalStorageKeys.global_sources))
            globalSources = JSON.parse(localStorage.getItem(LocalStorageKeys.global_sources));
    } catch (err) {
        showToaster("Error", "Failed to check or update resources, check logs for more details.", { img: ICON_ERROR_PATH });
        console.error(err);
    }

}

//#endregion

//#region main

const searchParams = new URLSearchParams(window.location.search);

function main() {
    const lastSearch = localStorage.getItem(LocalStorageKeys.last_item_searched) ?? "";
    const lastCodex = firstNonEmpty(localStorage.getItem(LocalStorageKeys.last_searched_item), "wolf");
    search_category = firstNonEmpty(localStorage.getItem(LocalStorageKeys.last_selected_category), Categories.None);

    const lastModId = firstNonEmpty(localStorage.getItem(LocalStorageKeys.last_mod_selected), "starsector-core");
    setSelectedMod(lastModId)

    updateModSearch()

    // @ts-ignore
    EL.search_bar_text_box.value = lastSearch;
    EL.search_bar_text_box.addEventListener('input', () => {
        // @ts-ignore
        updateSearch(EL.search_bar_text_box.value);
        // @ts-ignore
        localStorage.setItem(LocalStorageKeys.last_item_searched, EL.search_bar_text_box.value);
    });

    if (searchParams.has("search")) {
        // @ts-ignore
        EL.search_bar_text_box.value = searchParams.get("search")
        updateSearch(searchParams.get("search"));
    }
    else
        updateSearch(lastSearch);

    if (searchParams.has("id"))
        updateCodex(searchParams.get("id"));
    else
        updateCodex(lastCodex);

    console.log(searchParams)

    if (searchParams.has("no_search"))
        handleNoSearchBar()
    if (searchParams.has("no_item_view"))
        handleNoItemView()
    if (searchParams.has("no_mod_list"))
        handleNoModList()
    if (searchParams.has("no_scroll_bar"))
        handleNoScrollBar()
    if (searchParams.has("no_border"))
        handleNoBorder()
    if (searchParams.has("no_share_icon"))
        handleNoShareIcon()
    if (searchParams.has("no_lower_content"))
        handleNoLowerContent()
}
//#endregion

const MAX_DISTANCE = 2;

//#region mod search list

function setSelectedMod(selectedModId) {
    const oldID = currentSelectedModId;
    currentSelectedModId = selectedModId;
    mod_info = globalSources[selectedModId]


    function getModLI() {
        // Find the matching mod item by text content
        const el = Array.from(
            document.querySelectorAll("#search_bar_mod_list_ul li > div:nth-of-type(2) > div:nth-of-type(1)")
        ).find(div =>
            div.textContent.trim().toLowerCase() === mod_info.name.trim().toLowerCase()
        );
        return el?.closest("li"); // cleaner than parentElement.parentElement
    }

    function highlightTarget() {
        const target = getModLI();
        if (target) {

            if (target.classList.contains("element-highlight"))
                return true;

            target.classList.add("element-highlight");

            // const simplebar = SimpleBar.instances.get(EL.search_list_container);
            // const scrollElement = simplebar.getScrollElement();

            // scrollElement.scrollTo({
            //     top: target.offsetTop,
            //     behavior: 'smooth'
            // }); // todo: make the mod list scrollable


            return true;
        }
        return false;
    }

    let target = getModLI();
    if (!highlightTarget()) {
        setTimeout(() => {
            if (!highlightTarget()) {
                showToaster(
                    "Error.",
                    `Could not find the mod list element to highlight for ${mod_info.name}.`,
                    { img: ICON_ERROR_PATH }
                );
            }
        }, 50);
    }

    localStorage.setItem(LocalStorageKeys.last_mod_selected, selectedModId)
    if (oldID != selectedModId)
        updateSearch();
}

function updateModSearch(filter = '') {
    const ul = EL.search_bar_mod_list_ul;
    ul.innerHTML = '';

    Object.keys(globalSources).forEach(key => {
        const mod = globalSources[key]
        if (!mod.id && !mod.name && !mod.version && !mod.icon && !mod.directory)
            return;

        const li = document.createElement('li');
        const modId = mod.id
        li.addEventListener('click', () => {
            ul.querySelectorAll(".element-highlight")
                .forEach(el => (el.classList.contains("element-highlight")) ? el.classList.remove("element-highlight") : "")
            li.classList.add("element-highlight")

            setSelectedMod(modId);
            // @ts-ignore
            updateSearch(EL.search_bar_text_box.value);
        });

        // image
        const imgDiv = make('');
        const img = document.createElement('img');
        img.src = `${BASE_PATH}/Resources/GameSources/` + ((mod.icon == null || !mod.icon) ? "question_mark.png" : "mods/" + mod.icon);
        imgDiv.appendChild(img);
        li.appendChild(imgDiv);

        // text
        const textDiv = make('');
        const titleDiv = make(firstNonEmpty(mod.name, mod.id));
        const authorDiv = make(mod.author);
        textDiv.append(titleDiv, authorDiv);
        li.appendChild(textDiv);

        ul.appendChild(li);
    })

}

//#endregion

//#region search list

/** @type {Categories} */
let search_category = Categories.None;

/** @param {Categories} [cat] */
function changeSearchCategory(cat) {
    search_category = cat;
    localStorage.setItem(LocalStorageKeys.last_selected_category, cat);
}

// @ts-ignore
function updateSearch(filter = '') {
    const ul = EL.search_bar_list_ul;
    ul.innerHTML = '';


    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(Categories.None);
            updateSearch();
        },
        title: "...",
        img: ICON_CODEX_ARROW_UP
    })
    switch (search_category) {
        case Categories.None  : renderRoot(ul);break;
        case Categories.Ships : renderShipList(ul, filter);break;
        case Categories.Stations : renderStationList(ul, filter);break;

        default : break;
    }
}

function renderRoot(/** @type HTMLElement */ul) {
    ul.innerHTML = ""; // kind of a nuclear option, but it works
    let shipsCat = Categories.Ships;
    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(shipsCat);
            updateSearch();
        },
        title: shipsCat,
        img: CODEX_ICON_SHIPS
    })

    let stationsCat = Categories.Stations;
    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(stationsCat);
            updateSearch();
        },
        title: stationsCat,
        img: CODEX_ICON_STATIONS
    })

    let weaponsCat = Categories.Weapons;
    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(weaponsCat);
            updateSearch();
        },
        title: weaponsCat,
        img: CODEX_ICON_WEAPONS
    })
}

function renderShipList(ul, filter = '') {
    const candidates = [];

    //#region add ships to the list
    for (const ship of globalSources.ships) {
        if (ship.owner != currentSelectedModId) continue;
        if (ship.hullSize === "FIGHTER") continue;
        const csv = globalSources.ship_data.find(s => s.id === ship.hullId);
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;
        if (!csv || csv.hints.includes("STATION")) continue;
        if (!csv || csv.name.startsWith("#")) continue;
        if (filter && substringLevenshtein(csv.name, filter) > MAX_DISTANCE) continue;

        candidates.push({ type: 'ship', ship, csv });
    }
    //#endregion

    //#region add skins to the list
    for (const skin of globalSources.skins) {
        if (skin.owner != currentSelectedModId) continue;
        if (skin.restoreToBaseHull) continue;
        const base = globalSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base || base.hullSize === "FIGHTER") continue;
        const csv = globalSources.ship_data.find(s => s.id === skin.baseHullId);
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;
        if (!csv || csv.hints.includes("STATION")) continue;
        if (!csv || csv.name.startsWith("#")) continue;
        if (filter && substringLevenshtein(skin.hullName, filter) > MAX_DISTANCE) continue;

        candidates.push({ type: 'skin', skin, base, csv });
    }
    //#endregion

    //#region sort
    candidates.sort((a, b) => {
        const nameA = firstNonEmpty(a.csv.name, a.skin?.hullName, a.base?.hullName, a.ship?.hullName);
        const nameB = firstNonEmpty(b.csv.name, b.skin?.hullName, b.base?.hullName, a.ship?.hullName);
        return nameA.localeCompare(nameB);
    });
    //#endregion

    //#region render
    for (const c of candidates) {
        const li = createListItem(ul,
            {
                title: firstNonEmpty(c.skin?.hullName, c.ship?.hullName),
                desc: c.csv.designation,
                id: c.type === 'skin' ? c.skin?.skinHullId : c.ship?.hullId,
            })

        updateImgShipSource(li.img, c);
    }
    //#endregion
}

function renderStationList(ul, filter = ''){
    const candidates = [];

    //#region add ships to the list
    for (const ship of globalSources.ships) {
        if (ship.owner != currentSelectedModId) continue;
        if (ship.hullSize === "FIGHTER") continue;
        const csv = globalSources.ship_data.find(s => s.id === ship.hullId);
        if (!csv || !csv.hints.includes("STATION")) continue;
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;
        if (!csv || csv.name.startsWith("#")) continue;
        if (filter && substringLevenshtein(csv.name, filter) > MAX_DISTANCE) continue;

        candidates.push({ type: 'ship', ship, csv });
    }
    //#endregion

    //#region add skins to the list
    for (const skin of globalSources.skins) {
        if (skin.owner != currentSelectedModId) continue;
        if (skin.restoreToBaseHull) continue;
        const base = globalSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base || base.hullSize === "FIGHTER") continue;
        const csv = globalSources.ship_data.find(s => s.id === skin.baseHullId);
        if (!csv || !csv.hints.includes("STATION")) continue;
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;
        if (!csv || csv.name.startsWith("#")) continue;
        if (filter && substringLevenshtein(skin.hullName, filter) > MAX_DISTANCE) continue;

        candidates.push({ type: 'skin', skin, base, csv });
    }
    //#endregion

    //#region sort
    candidates.sort((a, b) => {
        const nameA = firstNonEmpty(a.csv.name, a.skin?.hullName, a.base?.hullName, a.ship?.hullName);
        const nameB = firstNonEmpty(b.csv.name, b.skin?.hullName, b.base?.hullName, a.ship?.hullName);
        return nameA.localeCompare(nameB);
    });
    //#endregion

    //#region render
    for (const c of candidates) {
        const li = createListItem(ul,
            {
                title: firstNonEmpty(c.skin?.hullName, c.ship?.hullName),
                desc: c.csv.designation,
                id: c.type === 'skin' ? c.skin?.skinHullId : c.ship?.hullId,
            })

        updateImgShipSource(li.img, c);
    }
    //#endregion

}

/**
 * @param {HTMLElement} [ul] 
 * @param {{
 * title?: string;
 * desc?: string;
 * img?: string;
 * id?: string;
 * onClick?: () => void;
 * }} [args={}] 
 * @returns {{
 * li    : HTMLElement,
 * img   : HTMLImageElement,
 * title : HTMLElement,
 * desc  : HTMLElement,
 * }}
 */
function createListItem(ul, args = {}) {
    args = {
        ...{
            title: "",
            desc: "",
            id: "",
            onClick: () => {
                updateCodex(args.id);
                ul.querySelectorAll(".element-highlight")
                    .forEach(el => (el.classList.contains("element-highlight")) ? el.classList.remove("element-highlight") : "")
                li.classList.add("element-highlight")
            }
        }
        , ...args
    };


    const li = document.createElement('li');
    // const hullId = c.type === 'skin' ? c.skin?.skinHullId : c.ship?.hullId;
    if (args.id && localStorage.getItem(LocalStorageKeys.last_searched_item) == args.id) {
        li.classList.add("element-highlight")

        const simplebar = SimpleBar.instances.get(EL.search_list_container);
        const scrollElement = simplebar.getScrollElement();

        setTimeout(() => {
            scrollElement.scrollTo({
                top: li.offsetTop - 56,
                behavior: 'smooth'
            });
        }, 50);

    }

    li.addEventListener('click', args.onClick);

    // image
    const imgDiv = make('');
    const img = document.createElement('img');
    if (args.img)
        img.src = args.img;
    // updateImgShipSource(img, c)
    imgDiv.appendChild(img);
    li.appendChild(imgDiv);

    // text
    const textDiv = make('');
    // const titleDiv = make(firstNonEmpty(c.skin?.hullName, c.ship?.hullName));
    const titleDiv = make(args.title);
    // const descDiv = make(c.csv.designation);
    const descDiv = make(args.desc);
    textDiv.append(titleDiv, descDiv);
    li.appendChild(textDiv);

    ul.appendChild(li);

    return {
        ["li"]: li,
        ["img"]: img,
        ["title"]: titleDiv,
        ["desc"]: descDiv
    }
}

//#endregion

//#region populating codex

function updateCodex(selectedHull, log = true) {
    localStorage.setItem(LocalStorageKeys.last_searched_item, selectedHull);

    //#region data collection
    /** @type {Skin} */
    const skin = globalSources.skins.find(s => s.skinHullId === selectedHull);
    const baseHullId = skin ? skin.baseHullId : selectedHull;

    /** @type {ShipJSON} */
    const shipJson = globalSources.ships.find(s => s.hullId === baseHullId);
    setSelectedMod(firstNonEmpty(skin?.owner, shipJson.owner))

    /** @type {Description} */
    const description = globalSources.descriptions.find(d => d.id === firstNonEmpty(skin?.descriptionId, baseHullId) && d.type === "SHIP");
    /** @type {CSV} */
    let csv = globalSources.ship_data.find(s => s.id === baseHullId);

    const builtInMods = Object.values(shipJson.builtInMods ?? {}).concat(skin?.builtInMods ?? []).filter(s => !(skin?.removeBuiltInMods ?? []).includes(s))
    /** @type {Hullmod[]} */
    const hullmods = globalSources.hull_mods.filter(m => builtInMods.includes(m.id));

    // @ts-ignore
    const builtInWeapons = Object.values({ ...(shipJson.builtInWeapons ?? {}), ...(skin?.builtInWeapons ?? {}) }).filter(s => !(skin?.removeBuiltInWeapons ?? []).includes(s))

    /** @type {Weapon[]} */
    const weapons = globalSources.weapon_data.filter(w => {
        const tags = w.tags.trim().toLowerCase().split(",").map(s => s.trim());

        return builtInWeapons.includes(w.id)
        // && !tags.includes("no_drop")
        // && !tags.includes("no_sell")
        // && !tags.includes("no_dealer")
        // && !tags.includes("restricted")
    }
    );

    const builtInWings = Object.values({ ...shipJson.builtInWings ?? {}, ...(skin?.builtInWings) }).filter(s => !(skin?.removeBuiltInWings ?? []).includes(s))


    const wing_data_wings = globalSources.wing_data.filter(m => builtInWings.includes(m.id));
    wing_data_wings.forEach(w => {
        if (globalSources.ship_data.filter(s => s.id == w?.variant).length > 0) {
            w.variant_no_classification = w?.variant;
            return;
        }
        w.variant_no_classification = w?.variant.replace(/_[^_]*$/, '');
    });

    const wing_ship_ids = wing_data_wings.map(w => w.variant_no_classification);
    /** @type {Wing[]} */
    const wings =
        mergeByProperty(
            globalSources.ship_data.filter(m => wing_ship_ids.includes(m.id)),
            wing_data_wings,
            "id",
            "variant_no_classification"
        );

    /** @type {System} */
    const system = globalSources.ship_systems.find(s => s.id === firstNonEmpty(skin?.systemId, csv["system id"]));

    /** @type {System} */
    let right_click_system;
    const hasDefenseID = (csv["defense id"] != "") ? true : false;
    if (hasDefenseID)
        right_click_system = globalSources.ship_systems.find(s => s.id === csv["defense id"])

    /** @type {Description} */
    const systemDesc = globalSources.descriptions.find(d => d.id === system?.id && d.type === "SHIP_SYSTEM");

    const tech = firstNonEmpty(skin?.tech, skin?.manufacturer, csv["tech/manufacturer"])
    /** @type {Color} */
    const color = (tech && globalSources.colors[tech]) ? {
        type: tech,
        hex: globalSources.colors[tech]
    } : (tech) ? { type: tech, hex: "#9BE4FF" } : { type: "Common", hex: "#BEC8C8" };

    const sensorDict = { Frigate: 30, Destroyer: 60, Cruiser: 90, Capital: 150 };
    //#endregion

    //#region log
    if (log) {
        console.log(" ")
        console.log("Skin data:", skin);
        console.log("Base hull ID:", baseHullId);
        console.log("Ship JSON:", shipJson);
        console.log("CSV data:", csv);
        console.log("Description:", description);
        console.log("Weapons:", weapons)
        console.log("Wings:", wings)
        console.log("Hullmods:", hullmods);
        console.log("Ship system:", system);
        if (hasDefenseID)
            console.log("Ship right click system:", right_click_system);
        console.log("System description:", systemDesc);
        console.log("Design color:", color);
        console.log(" ")
    }
    //#endregion

    //#region render
    const headerRet = setHeader(shipJson, csv, skin);
    setImage(shipJson, skin);
    setCombatStats(csv, shipJson, skin);
    setLogistics(csv, sensorDict);
    setDefense(csv, right_click_system);
    setFluxAndSpeed(csv);
    setSystem(system, systemDesc);
    renderMounts(shipJson, skin, csv);
    renderBuiltInArmaments(shipJson, skin, weapons, wings);
    renderHullmods(hullmods);
    setDesignType(color);
    setDescription(description, skin);
    setPrice(csv, skin);
    //#endregion

    //#region return

    /** @type {ship_data} */
    current_ship = {
        hullName: headerRet.name,
        hullHeader: headerRet.header,
        selectedHull: selectedHull,
        // @ts-ignore
        image: EL.ship_image.src,
        baseHullId: baseHullId,
        skin: skin,
        shipJson: shipJson,
        csv: csv,
        description: description,
        weapons: weapons,
        wings: wings,
        hullmods: hullmods,
        system: system,
        right_click_system: right_click_system,
        systemDesc: systemDesc,
        color: color
    }


    return current_ship;

    //#endregion
}

/** @type {ship_data} */
let current_ship;


// @ts-ignore
window.updateCodex = updateCodex;

function setHeader(ship, csv, skin) {
    const name = firstNonEmpty(skin?.hullName, csv.name);
    EL.ship_name_header.textContent = `${name}-class ${firstNonEmpty(skin?.hullDesignation, csv?.designation)}`;
    return { name: name, header: EL.ship_name_header.textContent };
}

function setImage(ship, skin) {
    const img = EL.ship_image
    // @ts-ignore
    updateImgShipSource(img, { ["ship"]: ship, ["skin"]: skin })
}

function setCombatStats(csv, ship, skin) {
    setValue(EL.cr_deployment, csv["CR to deploy"], "%");
    setValue(EL.recovery_rate, csv["cr %/day"], "%");
    setValue(EL.recovery_cost, csv["supplies/rec"]);
    setValue(EL.deployment_points, csv["supplies/rec"]);
    setValue(EL.peak_performance_time, csv["peak CR sec"]);
    EL.crew_complement.textContent = `${csv["min crew"]} / ${csv["max crew"]}`;
    EL.hull_size.textContent = capitalize(ship.hullSize).replace("_", " ").replace("ship", "");
    setValue(EL.ordnance_points, firstNonEmpty(skin?.ordnancePoints, csv["ordnance points"]));
    setValue(EL.supplies_month, parseFloat(csv["supplies/mo"]).toFixed(1));
}

function setLogistics(csv, sensorDict) {
    setValue(EL.cargo_cap, csv["cargo"]);
    setValue(EL.crew_cap, csv["max crew"]);
    setValue(EL.crew_min, csv["min crew"]);
    setValue(EL.fuel_cap, csv["fuel"]);
    setValue(EL.burn_max, csv["max burn"]);
    setValue(EL.fuel_cost, csv["fuel/ly"]);
    const size = EL.hull_size.textContent.trim();
    setValue(EL.sensor_profile, sensorDict[size]);
    setValue(EL.sensor_strength, sensorDict[size]);
}

function setDefense(csv, right_click_system) {
    setValue(EL.hull_integrity, csv["hitpoints"]);
    setValue(EL.armor_rating, csv["armor rating"]);


    const hasDefenseID = (right_click_system) ? true : false
    const shieldType = csv["shield type"];
    EL.defense_type.textContent = capitalize(right_click_system?.name ?? {
        FRONT: "Front Shield",
        OMNI: "Shield",
        PHASE: "Phase Cloak",
        NONE: "None"
    }[shieldType] ?? "—");

    // reset properties
    [1, 2, 3].forEach(i => {
        EL[`defense_property_${i}_name`].textContent = "";
        EL[`defense_property_${i}_val`].textContent = "";
    });

    if ((shieldType === "FRONT" || shieldType === "OMNI") && !hasDefenseID) {
        EL.defense_property_1_name.textContent = "Shield arc";
        EL.defense_property_1_val.textContent = csv["shield arc"];
        EL.defense_property_2_name.textContent = "Shield upkeep/sec";
        EL.defense_property_2_val.textContent = (parseFloat(csv["shield upkeep"]) * parseFloat(csv["flux dissipation"])).toFixed(1);
        EL.defense_property_3_name.textContent = "Shield flux/damage";
        EL.defense_property_3_val.textContent = parseFloat(csv["shield efficiency"]).toFixed(1);
    } else if (shieldType === "PHASE" && !hasDefenseID) {
        const flux = csv["max flux"];
        EL.defense_property_1_name.textContent = "Cloak activation cost";
        EL.defense_property_1_val.textContent = String(csv["phase cost"] * flux);
        EL.defense_property_2_name.textContent = "Cloak upkeep/sec";
        EL.defense_property_2_val.textContent = String(csv["phase upkeep"] * flux);
    } else {
        const leftChar = "&nbsp;"
        const rightChar = ""
        EL.defense_property_1_name.innerHTML = leftChar;
        EL.defense_property_1_val.innerHTML = rightChar;
        EL.defense_property_2_name.innerHTML = leftChar;
        EL.defense_property_2_val.innerHTML = rightChar;
        EL.defense_property_3_name.innerHTML = leftChar;
        EL.defense_property_3_val.innerHTML = rightChar;
    }
}

function setFluxAndSpeed(csv) {
    setValue(EL.flux_cap, csv["max flux"]);
    setValue(EL.flux_diss, csv["flux dissipation"]);
    setValue(EL.speed_max, csv["max speed"]);
}

function setSystem(system, desc) {
    EL.system_title.textContent = (system?.name != "") ? system?.name : "No name… yet";
    EL.system_description.textContent = firstNonEmpty(desc?.text1, "No description… yet");
}

function renderMounts(shipJson, skin, csv) {

    const slots = (shipJson.weaponSlots ?? [])
        .map(slot => {
            slot = skin?.weaponSlotChanges?.[slot.id] ? { ...slot, ...skin.weaponSlotChanges[slot.id] } : slot;
            if (slot.mount === "HIDDEN" || slot.type === "SYSTEM" || slot.type === "DECORATIVE") return null;
            if (skin?.removeWeaponSlots?.includes(slot.id)) return null;
            return slot;
        })
        .filter(Boolean);

    const order = ["LARGE", "MEDIUM", "SMALL"];
    slots.sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));

    const counts = slots.reduce((acc, s) => {
        const key = `${s.type}|${s.size}`;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    EL.mounts_list.innerHTML = "";
    for (const [key, cnt] of Object.entries(counts)) {
        const [type, size] = key.split('|');
        //// + (parseInt(size) > 1 ? "" : "s")
        const li = make(`<span>${cnt}x</span> ${capitalize(size)} ${capitalize(type)}`, 'li');
        EL.mounts_list.appendChild(li);
    }

    const fighterBayCount = firstNonEmpty(skin?.fighterBays, csv["fighter bays"])
    if (fighterBayCount > 0) {
        const li = make(`<span>${fighterBayCount}x</span> Fighter Bay`, 'li');
        EL.mounts_list.appendChild(li);
    }

    if (!EL.mounts_list.children.length) EL.mounts_list.appendChild(make("None", 'li'));
}

function renderBuiltInArmaments(
    /** @type {ShipJSON} */
    shipJson,
    /** @type {Skin} */
    skin,
    /** @type {Weapon[]} */
    weapons,
    /** @type {Wing[]} */
    wings
) {
    let counts = {
        ...Object.values(
            weapons.filter(
                w => shipJson.weaponSlots
                    .find(s => s.id == Object.keys(shipJson.builtInWeapons ?? {})
                        .find(k => shipJson.builtInWeapons[k] == w.id)
                    )?.type != "DECORATIVE"
            ) // what this does that it gets the weapon slot from weapon id and checks if the slot is decorative
        ).reduce((acc, w) => {
            acc[w.id] = // hope this doesnt explode!!!!
            {
                id: w,
                count: (acc[w.id]?.count ?? 0) + 1,
                type: "WEAPON",
                weapon: w
            };
            return acc;
        }, {}),
        ...Object.values(shipJson.builtInWings ?? {}).filter(s => !(skin?.removeBuiltInWings ?? []).includes(s)).reduce((acc, id) => {
            acc[id] =
            {
                id: id,
                count: (acc[id]?.count ?? 0) + 1,
                type: "WING"
            };
            return acc;
        }, {}),
    }


    EL.armaments_list.innerHTML = "";
    for (const [key, item] of Object.entries(counts)) {
        let li;
        if (item.type == "WEAPON")
            li = make(`<span>${item.count}x</span> ${capitalize(item.weapon.name)}`, 'li');
        else if (item.type == "WING")
            li = make(`<span>${item.count}x</span> ${capitalize(wings.find(s => s.id == item.id).name)} Drone Wing`, 'li');


        EL.armaments_list.appendChild(li);
    }


    if (!EL.armaments_list.children.length) EL.armaments_list.appendChild(make("None", 'li'));
}

function renderHullmods(mods) {
    EL.hullmods_list.innerHTML = "";
    if (mods.length === 0) {
        EL.hullmods_list.appendChild(make("None", 'li'));
        return;
    }
    mods.forEach(m => {
        if (m.tags.includes("dmod")) {
            const li = make("", "li");
            const span = make(m.name, 'span');
            const span_D = make(" (D)", 'span');
            li.appendChild(span);
            li.appendChild(span_D);
            EL.hullmods_list.appendChild(li)
        }
        else
            EL.hullmods_list.appendChild(make(m.name, 'li'))
    });
}

function setDesignType(color) {
    EL.design_type.dataset.className = color.type;
    EL.design_type.style.setProperty('--data-class-color', color.hex);
}

function setDescription(desc, skin) {
    const parts = [desc?.text1, desc?.text2, desc?.text3, desc?.text4, desc?.text5].filter(Boolean);
    let html = parts.map(t => t.replaceAll("\r\n", '<br/>')).join('<br/>');
    if (skin?.descriptionPrefix?.length > 5) html = `${skin.descriptionPrefix}<br><br>${html}`;
    EL.ship_description.innerHTML = html;
}

function setPrice(csv, skin) {
    const price = firstNonEmpty(
        skin?.baseValue,
        (parseFloat(csv["base value"]) * (skin?.baseValueMult ?? 1.0)).toLocaleString('en-US', { style: 'currency', currency: 'EUR' }).slice(1));
    EL.ship_price.dataset.price = price;
}

//#endregion

//#region url paramaters

function handleNoSearchBar() {
    EL.search_bar.classList.add("d-none");
    EL.item_view.style.width = "100%";
    EL.codex.style.width = "820px";
}

function handleNoItemView() {
    EL.item_view.classList.add("d-none");
    EL.search_bar.style.width = "100%";
    EL.codex.style.width = "205px";
}

function handleNoModList() {
    EL.mod_list.classList.add("d-none");
    EL.main_div.classList.remove("center-grid")
    EL.main_div.classList.add("center-grid-img")

}

function handleNoScrollBar() {
    document.querySelectorAll(".simplebar-track").forEach(e => e.classList.add("d-none"));
}

function handleNoBorder() {
    document.querySelectorAll(".codex-border").forEach(e => e.classList.remove("codex-border"));
}

function handleNoShareIcon() {
    document.querySelector(".share").classList.add("d-none")
}

function handleNoLowerContent() {
    document.querySelector(".lower-content").classList.add("d-none")
    EL.codex.style.height = "418px"
}

//#endregion

//#region toaster


/**
 * @param {string} title
 * @param {string} text
 * @param {{ img?: string; duration?: number }} [options]
 * @returns {{
 * removeToaster : () => void,
 * setTitle      : (newTitle: string) => void,
 * setText       : (newText: string) => void,
 * setImg        : (newImage: string) => void,
 * toaster       : HTMLElement,
 * }}
 */
function showToaster(title, text, options = {}) {
    options = { ...{ img: "", duration: 5000, }, ...options };
    const toaster = document.createElement("div");
    toaster.classList.add("toaster")
    toaster.classList.add("d-flex")
    toaster.classList.add("codex-border")

    const toaster_image = document.createElement("img");
    toaster_image.classList.add("toaster-image")

    const toaster_content_container = document.createElement("div");


    const toaster_title = document.createElement("span");
    toaster_title.classList.add("toaster-title")

    const toaster_text_container = document.createElement("div");
    toaster_text_container.classList.add("toaster-text");

    const toaster_text = document.createElement("span");


    toaster.appendChild(toaster_image);
    toaster.appendChild(toaster_content_container);
    toaster_content_container.appendChild(toaster_title);
    toaster_content_container.appendChild(toaster_text_container);
    toaster_text_container.appendChild(toaster_text);

    document.body.appendChild(toaster);


    toaster_title.innerText = title;
    toaster_text.innerText = text;

    // @ts-ignore
    toaster_image.src = options.img;

    toaster.style.right = "-274px";

    setTimeout(() => {
        toaster.style.right = "0px";
    }, 25);

    setTimeout(() => removeToaster(), options.duration);

    function removeToaster() {
        toaster.style.right = "-274px";
        setTimeout(() => toaster.remove(), 1000)
    }

    function setTitle(t) {
        toaster_title.innerText = t;
    }

    function setText(t) {
        toaster_text.innerText = t;
    }

    function setImg(t) {
        toaster_image.src = t;
    }

    return {
        ["setTitle"]: setTitle,
        ["setText"]: setText,
        ["setImg"]: setImg,
        ["removeToaster"]: removeToaster,
        ["toaster"]: toaster,
    };
}

// @ts-ignore
window.showToaster = showToaster;

//#endregion

//#region tests

async function runUpdateCodexTest() {
    const candidates = [];

    for (const ship of globalSources.ships) {
        if (ship.hullSize === "FIGHTER") continue;
        const csv = globalSources.ship_data.find(s => s.id === ship.hullId);
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;

        candidates.push({ type: 'ship', ship, csv });
    }
    for (const skin of globalSources.skins) {
        if (skin.restoreToBaseHull) continue;
        const base = globalSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base || base.hullSize === "FIGHTER") continue;
        const csv = globalSources.ship_data.find(s => s.id === skin.baseHullId);
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;

        candidates.push({ type: 'skin', skin, base, csv });
    }

    const toaster = showToaster("Running Checks...", "", { img: ICON_INFO_PATH, duration: 600_000 });

    let errorCount = 0;

    for (let i = 0; i < candidates.length; i++) {
        const s = candidates[i];
        try {
            const codex_ship = updateCodex(firstNonEmpty(s.skin?.skinHullId, s.csv.id), false)
            updateImgShipSource(toaster.toaster.querySelector("img"), {
                ["base"]: codex_ship.shipJson,
                ["ship"]: codex_ship.shipJson,
                ["skin"]: codex_ship.skin,
            })
            toaster.setText(
                `[${i + 1}/${candidates.length + 1}]\n` +
                codex_ship.hullHeader
            )
            await new Promise(resolve => setTimeout(resolve, 2))
        } catch (err) {
            console.warn("Error for: " + firstNonEmpty(s.skin?.skinHullId, s.csv.id))
            console.error(err)
            errorCount++;
        }
    }

    toaster.removeToaster();
    if (errorCount > 0) {
        showToaster("Found Errors", "Check log for more information.", { img: ICON_ERROR_PATH })
    } else {
        showToaster("No Error Found", "", { img: ICON_INFO_PATH })
    }

}

//#endregion