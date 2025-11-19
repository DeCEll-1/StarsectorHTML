//#region global vars

// get this file from: https://www.npmjs.com/package/simplebar?activeTab=code
/// <reference path="./Resources/libs/SimpleBar/simplebar.js" />
/// <reference path="./consts.js" />
/// <reference path="./codex_consts.js" />


/** @type {Global} */
let globalSources;
let currentSelectedModId
let mod_info;


//#endregion

//#region elements
// @ts-ignore
/** @type {EL} */
let EL;
function updateEL() {
    const ids = [
        // containers
        "codex", "item_view", "main_div",
        // header
        "ship_name_header", "image",
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
        "design_type", "description", "price", "related_entries",
        // toaster
        "toaster", "toaster_image", "toaster_title", "toaster_text",
        // search
        "search_bar_text_box", "search_bar_list_ul", "search_bar", "search_list_container",
        // weapon
        "primary_role", "mount_type", "stat_modifier_specification", "op_cost", "range", "damage",
        "damage_second", "emp_damage", "flux_second", "flux_shot", "flux_non_emp_damage",
        "damage_type", "tracking", "turn", "speed", "accuracy", "seconds_reload", "max_ammo",
        "reload_size", "refire_delay", "type_image",
        "customPrimary", "customAncillary", "hitpoints", "seconds_reload_name", "max_ammo_name",
        "reload_size_name", "no_recharge_ammo_display", "burst_size", "stats_container",
        "damage_second_name", "flux_second_name"

    ];
    // @ts-ignore
    EL = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
}
updateEL();
//#endregion

//#region helper functions

function capitalize(s) { return ((s[0] ?? "NULL").toUpperCase() + (s ?? "NULL").slice(1).toLowerCase()).replace("_", " "); }
/** @param {string} text */
function format(text, ...els) {
    return text.split("%s").reduce((acc, curr, i) => {
        return acc + curr + ((els[0][i]) ? "<span class='stat-yellow'>" + els[0][i] + "</span>" : "");
    }, "")
}
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

function getWeaponImagePath(weapon) {
    return `${BASE_PATH}/Resources/GameSources/mods/${globalSources[weapon?.owner].directory}/` + firstNonEmpty(weapon.turretSprite, weapon.hardpointSprite);
}

function getWeaponImagePathCore(weapon) {
    return `${BASE_PATH}/Resources/GameSources/mods/starsector-core/` + firstNonEmpty(weapon.turretSprite, weapon.hardpointSprite);
}

function updateImgWeaponSource(img,
    /** @type {{weapon?: WeaponJson, weapon_data?: WeaponCSV}} */
    c
) {
    img.src = getWeaponImagePath(c.weapon);
    img.onerror = () => {
        img.src = getWeaponImagePathCore(c.weapon)
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
        let updateTimeURL = "https://raw.githubusercontent.com/DeCEll-1/StarsectorHTML/refs/heads/main/Resources/GameSources/mods/creation_date.txt";
        if (location.hostname == "127.0.0.1") {
            updateTimeURL = `${BASE_PATH}/Resources/GameSources/mods/creation_date.txt`
        }

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
        ]).then(([data]) => {
            globalSources = data; localStorage.setItem(LocalStorageKeys.global_sources, JSON.stringify(globalSources));
        })

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

    if (searchParams.has("category"))
        // @ts-ignore
        changeSearchCategory(searchParams.get("category"));
    else
        changeSearchCategory(search_category);

    console.log(searchParams)

    handleParams();
}

function handleParams() {
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
// @ts-ignore
window.handleParams = handleParams;
//#endregion

const MAX_DISTANCE = 2;
let testing = false;

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

    // @ts-ignore
    // @ts-ignore
    let target = getModLI();
    if (!highlightTarget()) {
        setTimeout(() => {
            if (!highlightTarget()) {
                showToaster(
                    "Error.",
                    `Error while rendering ${mod_info.name}.`,
                    { img: ICON_ERROR_PATH }
                );
            }
        }, 50);
    }

    localStorage.setItem(LocalStorageKeys.last_mod_selected, selectedModId)
    if (oldID != selectedModId && !testing)
        updateSearch();
}

// @ts-ignore
// @ts-ignore
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
            updateSearch(filter);
        },
        title: "...",
        img: ICON_CODEX_ARROW_UP
    })
    switch (search_category) {
        case Categories.None: renderRoot(ul, filter); break;
        case Categories.Ships: renderShipList(ul, filter); break;
        case Categories.Stations: renderStationList(ul, filter); break;
        case Categories.Weapons: renderWeaponList(ul, filter); break;

        default:
            break;
    }
}

function renderRoot(/** @type HTMLElement */ul, filter) {
    ul.innerHTML = ""; // kind of a nuclear option, but it works
    let shipsCat = Categories.Ships;
    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(shipsCat);
            updateSearch(filter);
        },
        title: shipsCat,
        img: CODEX_ICON_SHIPS
    })

    let stationsCat = Categories.Stations;
    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(stationsCat);
            updateSearch(filter);
        },
        title: stationsCat,
        img: CODEX_ICON_STATIONS
    })

    let weaponsCat = Categories.Weapons;
    createListItem(ul, {
        onClick: () => {
            changeSearchCategory(weaponsCat);
            updateSearch(filter);
        },
        title: weaponsCat,
        img: CODEX_ICON_WEAPONS
    })
}
//#region ships
/** @param {{ ship?: ShipJSON; skin?: Skin; modId?: string; filter?: string; }} [args]*/
function isShipLegit(args = {}) {
    args = { ...{ modId: "starsector-core", filter: "" }, ...args };
    const owner = args.skin?.owner ?? args.ship?.owner;
    if (!args.ship) return false;
    if (owner !== args.modId && !testing) return false;
    if (args.ship.hullSize === "FIGHTER") return false;
    if (args.skin?.restoreToBaseHull) return false;
    const csvId = args.skin ? args.skin.baseHullId : args.ship.hullId;
    const csv = globalSources.ship_data.find(s => s.id === csvId);
    if (!csv) return false;
    if (csv.hints.includes("HIDE_IN_CODEX")) return false;
    if (csv.hints.includes("STATION")) return false;
    if (csv.name.startsWith("#")) return false;
    if (args.filter) {
        const nameToSearch = args.skin ? args.skin.hullName : csv.name;
        if (substringLevenshtein(nameToSearch, args.filter) > MAX_DISTANCE) {
            return false;
        }
    }
    return true;
}

function getShipCandidates(filter) {
    const candidates = [];

    //#region add ships to the list
    for (const ship of globalSources.ships) {
        if (!isShipLegit({ ship: ship, modId: currentSelectedModId, filter: filter })) continue;

        const csv = globalSources.ship_data.find(s => s.id === ship.hullId);
        candidates.push({ type: 'ship', ship, csv });
    }
    //#endregion

    //#region add skins to the list
    for (const skin of globalSources.skins) {
        const base = globalSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base) continue;                         // base hull missing → skip

        if (!isShipLegit({ ship: base, skin, modId: currentSelectedModId, filter })) continue;

        const csv = globalSources.ship_data.find(s => s.id === skin.baseHullId);
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

    return candidates;
}

function renderShipList(ul, filter = '') {
    const candidates = getShipCandidates(filter);

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
//#endregion

//#region stations
function getStationCandidates(filter) {
    const candidates = [];

    //#region add ships to the list
    for (const ship of globalSources.ships) {
        if (!isStationLegit({ ship: ship, modId: currentSelectedModId, filter: filter })) continue;

        const csv = globalSources.ship_data.find(s => s.id === ship.hullId);
        candidates.push({ type: 'ship', ship, csv });
    }
    //#endregion

    //#region add skins to the list
    for (const skin of globalSources.skins) {
        const base = globalSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base) continue;                         // base hull missing → skip

        if (!isStationLegit({ ship: base, skin, modId: currentSelectedModId, filter })) continue;

        const csv = globalSources.ship_data.find(s => s.id === skin.baseHullId);
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


    return candidates;
}

/** @param {{ ship?: ShipJSON; skin?: Skin; modId?: string; filter?: string; }} [args]*/
function isStationLegit(args = {}) {
    args = { ...{ modId: "starsector-core", filter: "" }, ...args };
    const owner = args.skin?.owner ?? args.ship?.owner;
    if (!args.ship) return false;
    if (owner !== args.modId && !testing) return false;
    if (args.ship.hullSize === "FIGHTER") return false;
    if (args.skin?.restoreToBaseHull) return false;
    const csvId = args.skin ? args.skin.baseHullId : args.ship.hullId;
    const csv = globalSources.ship_data.find(s => s.id === csvId);
    if (!csv) return false;
    if (csv.hints.includes("HIDE_IN_CODEX")) return false;
    if (!csv.hints.includes("STATION")) return false;
    if (csv.name.startsWith("#")) return false;
    if (args.filter) {
        const nameToSearch = args.skin ? args.skin.hullName : csv.name;
        if (substringLevenshtein(nameToSearch, args.filter) > MAX_DISTANCE) {
            return false;
        }
    }
    return true;
}

function renderStationList(ul, filter = '') {
    const candidates = [];

    //#region add ships to the list
    for (const ship of globalSources.ships) {
        if (!isStationLegit({ ship: ship, modId: currentSelectedModId, filter: filter })) continue;

        const csv = globalSources.ship_data.find(s => s.id === ship.hullId);
        candidates.push({ type: 'ship', ship, csv });
    }
    //#endregion

    //#region add skins to the list
    for (const skin of globalSources.skins) {
        const base = globalSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base) continue;                         // base hull missing → skip

        if (!isStationLegit({ ship: base, skin, modId: currentSelectedModId, filter })) continue;

        const csv = globalSources.ship_data.find(s => s.id === skin.baseHullId);
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
//#endregion

// #region weapons

function getWeaponCandidates(filter) {
    const candidates = [];
    for (const weapon_data of globalSources.weapon_data) {
        const weapon = globalSources.weapons.find(w => w.id == weapon_data.id);

        if (!isWeaponLegit({ weapon: weapon, weapon_data: weapon_data, modId: currentSelectedModId, filter: filter })) continue;

        candidates.push({ weapon: weapon, weapon_data: weapon_data });
    }
    candidates.sort((a, b) => a.weapon_data.name.localeCompare(b.weapon_data.name));

    return candidates;
}

/** @param {{ weapon?: WeaponJson; weapon_data?: WeaponCSV; modId?: string; filter?: string; }} [args]*/
function isWeaponLegit(args) {
    args = { ...{ modId: "starsector-core", filter: "" }, ...args };
    const owner = args?.weapon?.owner;
    if (owner !== args.modId && !testing) return false;
    if (args.weapon_data?.hints.includes("HIDE_IN_CODEX")) return false;
    if (args.weapon_data?.hints.includes("SYSTEM")) return false;
    if (args.weapon_data?.name.startsWith("#")) return false;
    if (args.filter) {
        const nameToSearch = args.weapon_data.name;
        if (substringLevenshtein(nameToSearch, args.filter) > MAX_DISTANCE) {
            return false;
        }
    }
    return true;
}

function renderWeaponList(ul, filter = '') {
    /* 
    was gonna use unicode characters to render the background for weapons, 
    but thats too complicated so i just made some svgs
    see "./mounts.css.txt" and "./Resources/SVGs/WeaponSlots/SVG/*.svg"
    */

    const candidates = getWeaponCandidates(filter);

    //#region render
    for (const c of candidates) {
        const li = createListItem(ul,
            {
                title: c.weapon_data.name,
                desc: capitalize(c.weapon.size),
                id: c.weapon_data.id,
            })
        li.imgDiv.classList.add("svg-weapon-overlay");

        li.imgDiv.classList.add(`${firstNonEmpty(c.weapon?.mountTypeOverride, c.weapon.type)[0].toUpperCase() + "_" + c.weapon.size[0].toUpperCase()}`)
        // li.imgDiv.classList.add("bg-i-size-search-list")
        updateImgWeaponSource(li.img, c);
    }
    //#endregion

}

// #endregion

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
 * li     : HTMLElement,
 * img    : HTMLImageElement,
 * imgDiv : HTMLElement,
 * title  : HTMLElement,
 * desc   : HTMLElement,
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
        ["imgDiv"]: imgDiv,
        ["title"]: titleDiv,
        ["desc"]: descDiv
    }
}

//#endregion

//#region populating codex

const VIEW_TEMPLATES = {
    [Categories.None]: { html: "", func: () => { } },
    [Categories.Ships]: { html: SHIP_HTML, func: updateShip },
    [Categories.Stations]: { html: SHIP_HTML, func: updateShip },
    [Categories.Weapons]: { html: WEAPON_HTML, func: updateWeapon },
};

function updateCategoryWithID(id) {
    // not perfect, its not required for weapons and ships and whatnot to have seperate IDs
    const skin = globalSources.skins.find(s => s.skinHullId === id);
    const baseHullId = skin ? skin.baseHullId : id;

    const shipJson = globalSources.ships.find(s => s.hullId === baseHullId);
    const weapon = globalSources.weapons.find(s => s.id == id);
    const weapon_data = globalSources.weapon_data.find(s => s.id == id);

    const shipLegit = isShipLegit({ ship: shipJson, skin, modId: currentSelectedModId, filter: "" });
    const stationLegit = isStationLegit({ ship: shipJson, modId: currentSelectedModId, filter: "" });
    const weaponLegit = isWeaponLegit({ weapon: weapon, weapon_data: weapon_data, modId: currentSelectedModId, filter: '' });

    const currentCategoryIsLegit =
        (search_category === Categories.Ships && shipLegit) ||
        (search_category === Categories.Stations && stationLegit) ||
        (search_category === Categories.Weapons && weaponLegit);


    if (currentCategoryIsLegit)
        return;

    if (shipLegit) {
        changeSearchCategory(Categories.Ships);
    } else if (stationLegit) {
        changeSearchCategory(Categories.Stations);
    } else if (weaponLegit) {
        changeSearchCategory(Categories.Weapons);
    }
    updateSearch();
}

function updateCodex(id, log = true) {
    localStorage.setItem(LocalStorageKeys.last_searched_item, id);
    current_id = id;
    updateCategoryWithID(id);

    EL.item_view.innerHTML = VIEW_TEMPLATES[search_category].html;
    handleParams();
    updateEL();

    return VIEW_TEMPLATES[search_category].func(id, log);
}



/** @type {ShipReturnData} */
let current_ship;
/** @type {WeaponReturnData} */
let current_weapon;
/** @type {string} */
let current_id;

// @ts-ignore
window.updateCodex = updateCodex;

function setPrice(price) {
    EL.price.dataset.price = price + "¢";
}

//#region ship

function updateShip(selectedHull, log) {

    //#region data collection
    const skin = globalSources.skins.find(s => s.skinHullId === selectedHull);
    const baseHullId = skin ? skin.baseHullId : selectedHull;

    const shipJson = globalSources.ships.find(s => s.hullId === baseHullId);
    setSelectedMod(firstNonEmpty(skin?.owner, shipJson.owner))

    const description = globalSources.descriptions.find(d => d.id === firstNonEmpty(skin?.descriptionId, baseHullId) && d.type === "SHIP");
    let csv = globalSources.ship_data.find(s => s.id === baseHullId);

    const builtInMods = Object.values(shipJson.builtInMods ?? {}).concat(skin?.builtInMods ?? []).filter(s => !(skin?.removeBuiltInMods ?? []).includes(s))
    const hullmods = globalSources.hull_mods.filter(m => builtInMods.includes(m.id));

    const builtInWeapons = Object.values({ ...(shipJson.builtInWeapons ?? {}), ...(skin?.builtInWeapons ?? {}) }).filter(s => !(skin?.removeBuiltInWeapons ?? []).includes(s))

    const weapons = globalSources.weapon_data.filter(w => {
        // @ts-ignore
        // @ts-ignore
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
    const headerRet = setShipHeader(shipJson, csv, skin);
    setShipImage(shipJson, skin);
    setShipCombatStats(csv, shipJson, skin);
    setShipLogistics(csv, sensorDict);
    setShipDefense(csv, right_click_system);
    setShipFluxAndSpeed(csv);
    setShipSystem(system, systemDesc);
    renderShipMounts(shipJson, skin, csv);
    renderShipBuiltInArmaments(shipJson, skin, weapons, wings);
    renderShipHullmods(hullmods);
    setShipDesignType(color);
    setShipDescription(description, skin);
    setShipPrice(csv, skin);
    //#endregion

    //#region return

    /** @type {ShipReturnData} */
    current_ship = {
        hullName: headerRet.name,
        hullHeader: headerRet.header,
        selectedHull: selectedHull,
        // @ts-ignore
        image: EL.image.src,
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

// @ts-ignore
// @ts-ignore
function setShipHeader(ship, csv, skin) {
    const name = firstNonEmpty(skin?.hullName, csv.name);
    EL.ship_name_header.textContent = `${name}-class ${firstNonEmpty(skin?.hullDesignation, csv?.designation)}`;
    return { name: name, header: EL.ship_name_header.textContent };
}

function setShipImage(ship, skin) {
    const img = EL.image
    // @ts-ignore
    updateImgShipSource(img, { ["ship"]: ship, ["skin"]: skin })
}

function setShipCombatStats(csv, ship, skin) {
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

function setShipLogistics(csv, sensorDict) {
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

function setShipDefense(csv, right_click_system) {
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

function setShipFluxAndSpeed(csv) {
    setValue(EL.flux_cap, csv["max flux"]);
    setValue(EL.flux_diss, csv["flux dissipation"]);
    setValue(EL.speed_max, csv["max speed"]);
}

function setShipSystem(system, desc) {
    EL.system_title.textContent = (system?.name != "") ? system?.name : "No name… yet";
    EL.system_description.textContent = firstNonEmpty(desc?.text1, "No description… yet");
}

function renderShipMounts(shipJson, skin, csv) {

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

function renderShipBuiltInArmaments(
    /** @type {ShipJSON} */
    shipJson,
    /** @type {Skin} */
    skin,
    /** @type {WeaponCSV[]} */
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
    // @ts-ignore
    // @ts-ignore
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

function renderShipHullmods(mods) {
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

function setShipDesignType(color) {
    EL.design_type.dataset.className = color.type;
    EL.design_type.style.setProperty('--data-class-color', color.hex);
}

function setShipDescription(desc, skin) {
    const parts = [desc?.text1, desc?.text2, desc?.text3, desc?.text4, desc?.text5].filter(Boolean);
    let html = parts.map(t => t.replaceAll("\r\n", '<br/>')).join('<br/>');
    if (skin?.descriptionPrefix?.length > 5) html = `${skin.descriptionPrefix}<br><br>${html}`;
    EL.description.innerHTML = html;
}

function setShipPrice(csv, skin) {
    const price = firstNonEmpty(
        skin?.baseValue,
        (parseFloat(csv["base value"]) * (skin?.baseValueMult ?? 1.0)).toLocaleString('en-US', { style: 'currency', currency: 'EUR' }).slice(1));
    setPrice(price);
}

//#endregion

//#region weapons

function updateWeapon(weaponID, log) {

    //#region data collection

    const weapon = globalSources.weapons.find(s => s.id == weaponID);
    const weapon_data = globalSources.weapon_data.find(s => s.id == weaponID);
    const projectile = globalSources.projectiles.find(s => s.id == weapon.projectileSpecId);
    const description = globalSources.descriptions.find(d => d.id === weapon.id && d.type === "WEAPON");
    weapon_data["burst size"] = firstNonEmpty(weapon_data["burst size"], 1);
    weapon_data["reload size"] = firstNonEmpty(weapon_data["reload size"], 1);
    const tech = weapon_data["tech/manufacturer"]

    /** @type {Color} */
    const color = (tech && globalSources.colors[tech]) ? {
        type: tech,
        hex: globalSources.colors[tech]
    } : (tech) ? { type: tech, hex: "#9BE4FF" } : { type: "Common", hex: "#BEC8C8" };

    //#endregion

    //#region log

    if (log) {
        console.log(" ")
        console.log("Weapon:", weapon);
        console.log("Weapon CSV:", weapon_data);
        console.log("Projectile:", projectile);
        console.log("Description:", description);
        console.log("Color:", color);
        console.log(" ")
    }

    //#endregion

    //#region render

    setWeaponTitle(weapon_data);
    setWeaponDesignColor(color);
    setWeaponLore(description);
    setWeaponPrice(weapon_data);
    setWeaponImage(weapon);
    setPrimaryData(weapon, weapon_data);
    setAncillaryData(weapon, weapon_data, projectile);

    //#endregion

    /**@type {WeaponReturnData} */
    current_weapon = {
        weapon: weapon,
        weapon_data: weapon_data,
        projectile: projectile,
        color: color,
        description: description,
    }

    return current_weapon;
}

/** @param {WeaponCSV} weapon_data */
function setWeaponTitle(weapon_data) {
    const name = weapon_data.name;
    EL.ship_name_header.textContent = name;
    return { name: name, header: EL.ship_name_header.textContent };
}

/** @param {Color} color */
function setWeaponDesignColor(color) {
    if (color.type == "Common")
        EL.design_type.remove();
    EL.design_type.dataset.className = color.type;
    EL.design_type.style.setProperty('--data-class-color', color.hex);
}

/** @param {Description} description */
function setWeaponLore(description) {
    const parts = [description?.text1, description?.text2, description?.text3, description?.text4, description?.text5].filter(Boolean);
    // let html = parts.map(t => t.replaceAll("\r\n", '<br/>')).join('<br/>');
    let html = parts[0]?.replaceAll("\r\n", '<br/>') + ((parts[1] != "" && parts[1] != undefined) ? "<div class='ship-class mt-2' style='font-size:10px;'>" + parts[1] + "</div>" : "")
    EL.description.innerHTML = html;
}

/**@param {WeaponCSV} weapon_data */
function setWeaponPrice(weapon_data) {
    const price = (parseFloat(weapon_data["base value"]).toLocaleString('en-US', { style: 'currency', currency: 'EUR' }).slice(1));
    setPrice(price);
}

/**@param {WeaponJson} weapon */
function setWeaponImage(weapon) {
    updateImgWeaponSource(EL.image, { weapon: weapon })
    EL.image.parentElement.classList.remove(EL.image.parentElement.classList.values().find(s => s.includes("_")))
    EL.image.parentElement.classList.add(`${firstNonEmpty(weapon.mountTypeOverride, weapon.type)[0].toUpperCase() + "_" + weapon.size[0].toUpperCase()}`)
}

/**@param {WeaponCSV} weapon_data */
function getWeaponRefineDelay(weapon_data, isBeam = false) {
    return (!isBeam) ?
        Math.max(
            Number(weapon_data.chargeup) +
            (Number(weapon_data["burst delay"]) * (Number(weapon_data["burst size"]) - 1)) +
            Number(weapon_data.chargedown), 0.05)
        :
        Math.max(
            ((((Number(weapon_data["chargeup"]) +
                Number(weapon_data["chargedown"])) +
                Number(weapon_data["burst delay"]))) +
                Number(weapon_data["burst size"])),
            0.05
        )
}

/**@param {WeaponJson} weapon @param {WeaponCSV} weapon_data */
function setPrimaryData(weapon, weapon_data) {
    // @ts-ignore
    const isBeam = (weapon_data["beam speed"] != "" && weapon_data["beam speed"] != 0)
    const refire_delay = getWeaponRefineDelay(weapon_data, isBeam);

    EL.primary_role.innerText = weapon_data.primaryRoleStr;
    if (weapon.mountTypeOverride && weapon.type != weapon.mountTypeOverride) {
        EL.stat_modifier_specification.innerText = `Counts as ${capitalize(weapon.type)} for stat modifiers`
    } else {
        EL.stat_modifier_specification.parentElement.remove();
    }

    EL.mount_type.innerText = capitalize(weapon.size ?? "") + ", " + capitalize(weapon.mountTypeOverride ?? weapon.type ?? "");

    EL.op_cost.innerText = weapon_data.OPs;


    EL.range.innerText = weapon_data.range;

    const burstDamage = (isBeam) ? Number(weapon_data["damage/second"]) * (Number(weapon_data["burst size"]) + ((Number(weapon_data.chargeup) + Number(weapon_data.chargedown)) * (1.0 / 3.0)))
        : weapon_data["damage/shot"]
    const burstFlux = Number(weapon_data["energy/second"]) * (Number(weapon_data["chargeup"]) + Number(weapon_data["burst size"]))
    const sum = (Number(weapon_data.chargeup) + Number(weapon_data.chargedown) + Number(weapon_data["burst size"]) + Number(weapon_data["burst delay"]));
    const beamDps = (isBeam) ? burstDamage / sum
        : (weapon_data["damage/shot"] * weapon_data["burst size"]) / refire_delay

    let sustainedDamage = burstDamage * Number(weapon_data["ammo/sec"]);
    sustainedDamage = (sustainedDamage != 0) ? sustainedDamage : 9999999999;
    if (beamDps > sustainedDamage) {
        EL.damage_second_name.innerText = "Damage / second (sustained)"
        EL.flux_second_name.innerText = "Flux / second (sustained)"
    }

    if (isBeam) {
        EL.damage.innerText = Number(burstDamage.toFixed(0)).toString()
        EL.damage_second.innerText = Number(beamDps.toFixed(0)).toString() + ((beamDps > sustainedDamage) ? " (" + Number(sustainedDamage.toFixed(0)).toString() + ")" : "")
        // @ts-ignore
        EL.emp_damage.innerText = weapon_data.emp * (Number(weapon_data.chargedown) + Number(weapon_data.chargeup));

    } else {
        EL.damage.innerText = (weapon_data["burst size"] == 1) ? weapon_data["damage/shot"].toString() : weapon_data["damage/shot"] + "x" + weapon_data["burst size"];
        (weapon_data["burst size"] > 1) ? EL.burst_size.innerText = weapon_data["burst size"].toString() : EL.burst_size.parentElement.remove();
        if (weapon_data.noDPSInTooltip == "") {
            EL.damage_second.innerText = Number(beamDps.toFixed(0)).toString() + ((beamDps > sustainedDamage) ? " (" + Number(sustainedDamage.toFixed(0)).toString() + ")" : "")
            // EL.damage_second.innerText = firstNonEmpty(weapon_data["damage/second"], Number(beamDps.toFixed(0)));
        } else {
            EL.damage_second.parentElement.remove();
        }
        EL.emp_damage.innerText = weapon_data.emp;
    }

    if (!weapon_data.emp)
        EL.emp_damage.parentElement.remove();

    if (weapon_data["energy/shot"] != 0 || weapon_data["energy/second"] != 0) {
        if (isBeam) {
            EL.flux_shot.parentElement.remove();
            const flux_sec = burstFlux / sum
            const flux_dam = flux_sec / beamDps
            const sustainedFlux = burstDamage * Number(weapon_data["ammo/sec"]);

            EL.flux_second.innerText = Number(flux_sec.toFixed(0)).toString() + "" + ((beamDps > burstDamage) ? " (" + Number(burstFlux * Number(weapon_data["ammo/sec"])).toFixed(0).toString() + ")" : "");
            EL.flux_non_emp_damage.innerText = flux_dam.toFixed(1);
        }
        else {
            const flux_sec = weapon_data["energy/shot"] * weapon_data["burst size"] / refire_delay;
            if (weapon_data.noDPSInTooltip == "")
                EL.flux_second.innerText = Number(flux_sec.toFixed(0)).toString() + ((beamDps > sustainedDamage) ? " (" + Number((Number(weapon_data["energy/shot"]) * Number(weapon_data["ammo/sec"])).toFixed(0)).toString() + ")" : "");
            else
                // EL.flux_second.innerText = firstNonEmpty(weapon_data["energy/second"], Number(flux_sec.toFixed(0)));
                EL.flux_second.parentElement.remove();

            EL.flux_shot.innerText = weapon_data["energy/shot"].toString();
            EL.flux_non_emp_damage.innerText = (weapon_data["energy/shot"] / weapon_data["damage/shot"]).toFixed(2);
        }
    } else {
        EL.flux_second.parentElement.remove();
        EL.flux_shot.parentElement.remove();
        EL.flux_non_emp_damage.parentElement.remove();
    }

    if (weapon_data.customPrimary.includes("%s"))
        EL.customPrimary.innerHTML = format(weapon_data.customPrimary, weapon_data.customPrimaryHL.split("|"))
    else {
        let cusPrim = weapon_data.customPrimary;

        weapon_data.customPrimaryHL.split("|").forEach(s => {
            cusPrim = cusPrim.replace(s, "<span class='stat-yellow'>" + s + "</span>");
        });

        EL.customPrimary.innerHTML = cusPrim;
    }


}

/**@param {WeaponJson} weapon @param {WeaponCSV} weapon_data @param {Projectile} projectile */
function setAncillaryData(weapon, weapon_data, projectile) {
    // @ts-ignore
    const isBeam = (weapon_data["beam speed"] != "" && weapon_data["beam speed"] != 0)
    const refire_delay = getWeaponRefineDelay(weapon_data, isBeam);

    EL.damage_type.innerText = capitalize(weapon_data.type);
    switch (weapon_data.type) {
        case WeaponDamageType.ENERGY: EL.type_image.src = ICON_DAMAGE_TYPE_ENERGY; break;
        case WeaponDamageType.FRAGMENTATION: EL.type_image.src = ICON_DAMAGE_TYPE_FRAGMENTATION; break;
        case WeaponDamageType.HIGH_EXPLOSIVE: EL.type_image.src = ICON_DAMAGE_TYPE_HIGH_EXPLOSIVE; break;
        case WeaponDamageType.KINETIC: EL.type_image.src = ICON_DAMAGE_TYPE_KINETIC; break;
        case WeaponDamageType.OTHER: EL.type_image.src = ICON_DAMAGE_TYPE_OTHER; break;

        default:
            break;
    }

    EL.tracking.innerText = firstNonEmpty(weapon_data.trackingStr)
    if (weapon_data.trackingStr == "")
        EL.tracking.parentElement.remove();
    EL.speed.innerText = firstNonEmpty(weapon_data.speedStr)
    if (weapon_data.speedStr == "")
        EL.speed.parentElement.remove();

    function getTurnRate(turnRate) {
        if (turnRate <= 0) return "Can't turn";
        if (turnRate <= 5) return "Very Slow";
        if (turnRate <= 15) return "Slow";
        if (turnRate <= 25) return "Medium";
        if (turnRate <= 35) return "Fast";
        if (turnRate <= 50) return "Very Fast";
        return "Excellent";
    }

    function getSpread(maxSpread) {
        if (maxSpread <= 0) return "Perfect";
        if (maxSpread <= 2) return "Excellent";
        if (maxSpread <= 5) return "Good";
        if (maxSpread <= 10) return "Medium";
        if (maxSpread <= 15) return "Poor";
        if (maxSpread <= 20) return "Very Poor";
        return "Terrible";
    }


    if (projectile?.specClass == ProjectileSpecClass.missile) {
        EL.accuracy.parentElement.remove();
        EL.turn.parentElement.remove();

        EL.hitpoints.innerText = weapon_data["proj hitpoints"]
    } else { // ProjectileSpecClass.projectile
        EL.hitpoints.parentElement.remove();

        EL.accuracy.innerText = firstNonEmpty(weapon_data.accuracyStr, getSpread(weapon_data["max spread"]));
        EL.turn.innerText = firstNonEmpty(weapon_data.turnRateStr, getTurnRate(weapon_data["turn rate"]));
    }

    if (weapon.type == WeaponTypes.Energy) {
        EL.max_ammo_name.innerText = "Max charges";
        EL.seconds_reload_name.innerText = "Seconds / recharge";
        EL.reload_size_name.innerText = "Charges gained";
    }
    else if (weapon.type == WeaponTypes.Ballistic || weapon.type == WeaponTypes.Missile) {
        EL.max_ammo_name.innerText = "Max ammo";
        EL.seconds_reload_name.innerText = "Seconds / reload";
        EL.reload_size_name.innerText = "Reload size";
    }

    if (weapon_data.ammo != "" && Number(weapon_data.ammo) != 0 && weapon_data["ammo/sec"] == 0)
        if (weapon.type == WeaponTypes.Energy)
            if (weapon_data["energy/shot"] != 0)
                EL.no_recharge_ammo_display.innerText = "Limited ammo (" + weapon_data.ammo + ")";
            else
                EL.no_recharge_ammo_display.innerText = "No flux cost to fire, limited ammo (" + weapon_data.ammo + ")";
        else if (weapon.type == WeaponTypes.Ballistic || weapon.type == WeaponTypes.Missile)
            if (weapon_data["energy/shot"] != 0)
                EL.no_recharge_ammo_display.innerText = "Limited ammo (" + weapon_data.ammo + ")";
            else
                EL.no_recharge_ammo_display.innerText = "No flux cost to fire, limited ammo (" + weapon_data.ammo + ")";
        else;
    else
        EL.no_recharge_ammo_display.remove();

    if (weapon_data.ammo != "" && Number(weapon_data.ammo) != 0 && weapon_data["ammo/sec"] != 0) {
        EL.max_ammo.innerText = weapon_data.ammo;
        EL.seconds_reload.innerText = Number((1.0 / weapon_data["ammo/sec"] * Number(weapon_data["reload size"])).toFixed(2)).toString();
        EL.reload_size.innerText = firstNonEmpty(weapon_data["reload size"], 1);
    } else {
        EL.max_ammo.parentElement.remove();
        EL.seconds_reload.parentElement.remove();
        EL.reload_size.parentElement.remove();
    }

    if (weapon_data["burst size"] > 1)
        EL.burst_size.innerText = weapon_data["burst size"].toString();
    else
        EL.burst_size.parentElement.remove();
    EL.refire_delay.innerText = Number(refire_delay.toFixed(2)).toString();


    if (weapon_data.customAncillary.includes("%s"))
        EL.customAncillary.innerHTML = format(weapon_data.customAncillary, weapon_data.customAncillaryHL.split("|"))
    else {
        let cusPrim = weapon_data.customAncillary;

        weapon_data.customAncillaryHL.split("|").forEach(s => {
            cusPrim = cusPrim.replace(s, "<span class='stat-yellow'>" + s + "</span>");
        });

        EL.customAncillary.innerHTML = cusPrim;
    }


}



//#endregion

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
    document.querySelector(".ship-lore").classList.add("d-none")
    document.querySelector(".lower-content")?.classList?.add("d-none")
    if (EL.stats_container?.style?.width) EL.stats_container.style.width = "100%"
    EL.stats_container?.classList?.remove("me-4")
    EL.codex.style.height = "418px"
    EL.item_view.style.height = "418px"
    // EL.item_view.style.width = "min-content"
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
    if (searchParams.has("no_toaster"))
        return;

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
    testing = true;


    const toaster = showToaster("Running Checks...", "", { img: ICON_INFO_PATH, duration: 600_000 });
    let errorCount = 0;

    const IDs = [];

    const shipCandidates = getShipCandidates("");
    const stationCandidates = getStationCandidates("");
    const weaponCandidates = getWeaponCandidates("");

    const length = [
        shipCandidates.length,
        stationCandidates.length,
        weaponCandidates.length
    ].reduce((acc, curr) => acc + curr, 0) + 1
    let curr = 1;

    search_category = Categories.Ships;
    for (let i = 0; i < shipCandidates.length; i++) {
        const s = shipCandidates[i];
        const ID = firstNonEmpty(s.skin?.skinHullId, s.csv.id);
        try {
            /** @type {ShipReturnData} */
            // @ts-ignore
            const codex_ship = updateCodex(ID, false)
            updateImgShipSource(toaster.toaster.querySelector("img"), {
                ["base"]: codex_ship.shipJson,
                ["ship"]: codex_ship.shipJson,
                ["skin"]: codex_ship.skin,
            })
            toaster.setText(
                `[${curr}/${length}]\n` +
                codex_ship.hullHeader
            )
            await new Promise(resolve => setTimeout(resolve, 2))
        } catch (err) {
            console.warn("Error for: " + ID)
            console.error(err)
            errorCount++;
        }
        IDs.push(ID);
        curr++;
    }
    IDs.push(Categories.Stations)
    search_category = Categories.Stations;
    for (let i = 0; i < stationCandidates.length; i++) {
        const s = stationCandidates[i];
        const ID = firstNonEmpty(s.skin?.skinHullId, s.csv.id);
        try {
            /** @type {ShipReturnData} */
            // @ts-ignore
            const codex_ship = updateCodex(ID, false)
            updateImgShipSource(toaster.toaster.querySelector("img"), {
                ["base"]: codex_ship.shipJson,
                ["ship"]: codex_ship.shipJson,
                ["skin"]: codex_ship.skin,
            })
            toaster.setText(
                `[${curr}/${length}]\n` +
                codex_ship.hullHeader
            )
            await new Promise(resolve => setTimeout(resolve, 2))
        } catch (err) {
            console.warn("Error for: " + ID)
            console.error(err)
            errorCount++;
        }
        IDs.push(ID);
        curr++;
    }
    IDs.push(Categories.Weapons)
    search_category = Categories.Weapons;
    for (let i = 0; i < weaponCandidates.length; i++) {
        const s = weaponCandidates[i];
        if (!s.weapon) continue;
        const ID = s.weapon.id;
        try {
            /** @type {WeaponReturnData} */
            // @ts-ignore
            const codex_ship = updateCodex(ID, false)
            updateImgWeaponSource(toaster.toaster.querySelector("img"), {
                weapon: s.weapon,
                weapon_data: s.weapon_data
            })
            toaster.setText(
                `[${curr}/${length}]\n` +
                codex_ship.weapon_data.name
            )
            await new Promise(resolve => setTimeout(resolve, 2))
        } catch (err) {
            console.warn("Error for: " + ID)
            console.error(err)
            errorCount++;
        }
        IDs.push(ID);
        curr++;
    }

    toaster.removeToaster();
    if (errorCount > 0) {
        showToaster("Found Errors", "Check log for more information.", { img: ICON_ERROR_PATH })
    } else {
        showToaster("No Error Found!", "Went through " + length + " items", { img: ICON_INFO_PATH })
    }

    console.log(IDs.join("', '"))
    testing = false;
}

//#endregion