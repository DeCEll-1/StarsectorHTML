//#region global vars
// @ts-ignore
const REPO_NAME = "StarsectorHTML";
// @ts-ignore
const BASE_PATH = location.hostname === "127.0.0.1" ? "." : `/${REPO_NAME}`;

// @ts-ignore
let gameSources;

//#endregion

//#region elements
// @ts-ignore
const EL = (() => {
    const ids = [
        // containers
        "codex", "item_view",
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
        // misc
        "design_type", "ship_description", "ship_price", "related_entries",
        //
        "toaster", "toaster_image", "toaster_title", "toaster_text",
        // search
        "search_bar_text_box", "search_bar_ship_list_ul", "search_bar"
    ];
    return Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
})();
//#endregion

//#region helper functions
function capitalize(s) { return (s[0].toUpperCase() + s.slice(1).toLowerCase()).replace("_", " "); }
function setValue(el, val, suffix = '') { return el.textContent = (val == null) ? '—' : val + suffix; }
function make(html, tag = 'div') { const el = document.createElement(tag); el.innerHTML = html; return el; };
function firstNonEmpty(...vals) { return vals.find(v => v != null && v !== "") ?? "Unknown"; }

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
Promise.all([
    fetch(`${BASE_PATH}/Resources/GameSources/merged_game_sources.json`).then(r => r.json())
]).then(([data]) => { gameSources = data; main(); });
//#endregion

//#region main

// @ts-ignore
const searchParams = new URLSearchParams(window.location.search);

function main() {
    const lastSearch = localStorage.getItem("last_item_searched") ?? "";
    const lastCodex = localStorage.getItem("last_searched_item") ?? "wolf";

    // @ts-ignore
    EL.search_bar_text_box.value = lastSearch;
    EL.search_bar_text_box.addEventListener('input', () => {
        // @ts-ignore
        updateSearch(EL.search_bar_text_box.value);
        // @ts-ignore
        localStorage.setItem("last_item_searched", EL.search_bar_text_box.value);
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
    if (searchParams.has("no_scroll_bar"))
        handleNoScrollBar()
    if (searchParams.has("no_border"))
        handleNoBorder()
    if (searchParams.has("no_share_icon"))
        handleNoShareIcon()
}
//#endregion

//#region search list

// @ts-ignore
const MAX_DISTANCE = 2;
function updateSearch(filter = '') {
    const ul = EL.search_bar_ship_list_ul;
    ul.innerHTML = '';

    const candidates = [];

    //#region add ships to the list
    for (const ship of gameSources.ships) {
        if (ship.hullSize === "FIGHTER") continue;
        const csv = gameSources.ship_data.find(s => s.id === ship.hullId);
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;
        if (filter && substringLevenshtein(csv.name, filter) > MAX_DISTANCE) continue;

        candidates.push({ type: 'ship', ship, csv });
    }
    //#endregion

    //#region add skins to the list
    for (const skin of gameSources.skins) {
        if (skin.restoreToBaseHull) continue;
        const base = gameSources.ships.find(s => s.hullId === skin.baseHullId);
        if (!base || base.hullSize === "FIGHTER") continue;
        const csv = gameSources.ship_data.find(s => s.id === skin.baseHullId);
        if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;
        if (filter && substringLevenshtein(skin.hullName, filter) > MAX_DISTANCE) continue;

        candidates.push({ type: 'skin', skin, base, csv });
    }
    //#endregion

    //#region sort
    candidates.sort((a, b) => {
        const nameA = firstNonEmpty(a.csv.name, a.skin?.hullName, a.base?.hullName);
        const nameB = firstNonEmpty(b.csv.name, b.skin?.hullName, b.base?.hullName);
        return nameA.localeCompare(nameB);
    });
    //#endregion

    //#region render
    for (const c of candidates) {
        const li = document.createElement('li');
        const hullId = c.type === 'skin' ? c.skin?.skinHullId : c.ship?.hullId;
        li.addEventListener('click', () => updateCodex(hullId));

        // image
        const imgDiv = make('');
        const img = document.createElement('img');
        img.src = `${BASE_PATH}/Resources/GameSources/` + (firstNonEmpty(c.skin?.spriteName, c.ship?.spriteName));
        imgDiv.appendChild(img);
        li.appendChild(imgDiv);

        // text
        const textDiv = make('');
        const nameDiv = make(firstNonEmpty(c.skin?.hullName, c.ship?.hullName));
        const desigDiv = make(c.csv.designation);
        textDiv.append(nameDiv, desigDiv);
        li.appendChild(textDiv);

        ul.appendChild(li);
    }
    //#endregion
}

//#endregion

//#region populating codex

function updateCodex(selectedHull) {
    localStorage.setItem("last_searched_item", selectedHull);

    //#region data collection
    const skin = gameSources.skins.find(s => s.skinHullId === selectedHull);
    const baseHullId = skin ? skin.baseHullId : selectedHull;

    const shipJson = gameSources.ships.find(s => s.hullId === baseHullId);
    const description = gameSources.descriptions.find(d => d.id === firstNonEmpty(skin?.descriptionId, baseHullId) && d.type === "SHIP");
    let csv = gameSources.ship_data.find(s => s.id === baseHullId);

    const builtInMods = Object.values(shipJson.builtInMods ?? {}).concat(skin?.builtInMods ?? []).filter(s => !(skin?.removeBuiltInMods ?? []).includes(s))
    const hullmods = gameSources.hull_mods.filter(m => builtInMods.includes(m.id));

    const builtInWeapons = Object.values(shipJson.builtInWeapons ?? {}).filter(s => !(skin?.removeBuiltInWeapons ?? []).includes(s))
    const weapons = gameSources.weapon_data.filter(m => builtInWeapons.includes(m.id));

    const builtInWings = Object.values(shipJson.builtInWings ?? {}).filter(s => !(skin?.removeBuiltInWings ?? []).includes(s))


    const wing_data_wings = gameSources.wing_data.filter(m => builtInWings.includes(m.id));
    wing_data_wings.forEach(w => {
        w.variant_no_classification = w?.variant.replace(/[A-Z].*$/, '');
        if (w.variant_no_classification.slice(-1) == "_")
            w.variant_no_classification = w.variant_no_classification.slice(0, -1)
    });

    const wing_ship_ids = wing_data_wings.map(w => w.variant_no_classification);
    const wings =
        mergeByProperty(
            gameSources.ship_data.filter(m => wing_ship_ids.includes(m.id)),
            wing_data_wings,
            "id",
            "variant_no_classification"
        );

    const system = gameSources.ship_systems.find(s => s.id === firstNonEmpty(skin?.systemId, csv["system id"]));
    const systemDesc = gameSources.descriptions.find(d => d.id === system?.id && d.type === "SHIP_SYSTEM");

    const color = skin && gameSources.colors.find(c => c.type === firstNonEmpty(skin.tech, skin.manufacturer))
        || gameSources.colors.find(c => c.type === csv["tech/manufacturer"])
        || { type: "Common", hex: "#BEC8C8" };

    const sensorDict = { Frigate: 30, Destroyer: 60, Cruiser: 90, Capital: 150 };
    //#endregion

    //#region log
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
    console.log("System description:", systemDesc);
    console.log("Design color:", color);
    console.log(" ")
    //#endregion

    //#region render
    setHeader(shipJson, csv, skin);
    setImage(shipJson, skin);
    setCombatStats(csv, shipJson, skin);
    setLogistics(csv, sensorDict);
    setDefense(csv);
    setFluxAndSpeed(csv);
    setSystem(system, systemDesc);
    renderMounts(shipJson, skin, csv);
    renderBuiltInArmaments(shipJson, weapons, wings);
    renderHullmods(hullmods);
    setDesignType(color);
    setDescription(description, skin);
    setPrice(csv, skin);
    //#endregion

    //#region return

    current_ship = {
        selectedHull: selectedHull,
        image: `${BASE_PATH}/Resources/GameSources/` + (firstNonEmpty(skin?.spriteName, shipJson?.spriteName)),
        skin: skin,
        baseHullId: baseHullId,
        shipJson: shipJson,
        csv: csv,
        description: description,
        weapons: weapons,
        wings: wings,
        hullmods: hullmods,
        system: system,
        systemDesc: systemDesc,
        color: color
    }

    return current_ship;

    //#endregion
}

let current_ship;

window.updateCodex = updateCodex;

function setHeader(ship, csv, skin) {
    const name = firstNonEmpty(skin?.hullName, csv.name);
    EL.ship_name_header.textContent = `${name}-class ${firstNonEmpty(skin?.hullDesignation, csv?.designation)}`;
}

function setImage(ship, skin) {
    const src = skin?.spriteName ? skin.spriteName : ship.spriteName;
    // @ts-ignore // annoyence
    EL.ship_image.src = `${BASE_PATH}/Resources/GameSources/${src}`;
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

function setDefense(csv) {
    setValue(EL.hull_integrity, csv["hitpoints"]);
    setValue(EL.armor_rating, csv["armor rating"]);

    const shieldType = csv["shield type"];
    EL.defense_type.textContent = {
        FRONT: "Front Shield",
        OMNI: "Shield",
        PHASE: "Phase Cloak",
        NONE: "None"
    }[shieldType] ?? "—";

    // reset properties
    [1, 2, 3].forEach(i => {
        EL[`defense_property_${i}_name`].textContent = "";
        EL[`defense_property_${i}_val`].textContent = "";
    });

    if (shieldType === "FRONT" || shieldType === "OMNI") {
        EL.defense_property_1_name.textContent = "Shield arc";
        EL.defense_property_1_val.textContent = csv["shield arc"];
        EL.defense_property_2_name.textContent = "Shield upkeep/sec";
        EL.defense_property_2_val.textContent = parseFloat(csv["shield upkeep"]).toFixed(1);
        EL.defense_property_3_name.textContent = "Shield flux/damage";
        EL.defense_property_3_val.textContent = parseFloat(csv["shield efficiency"]).toFixed(1);
    } else if (shieldType === "PHASE") {
        const flux = csv["max flux"];
        EL.defense_property_1_name.textContent = "Cloak activation cost";
        EL.defense_property_1_val.textContent = String(csv["phase cost"] * flux);
        EL.defense_property_2_name.textContent = "Cloak upkeep/sec";
        EL.defense_property_2_val.textContent = String(csv["phase upkeep"] * flux);
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
            if (slot.mount === "HIDDEN" || slot.type === "SYSTEM" || slot.type === "DECORATIVE") return null;
            if (skin?.removeWeaponSlots?.includes(slot.id)) return null;
            return skin?.weaponSlotChanges?.[slot.id] ? { ...slot, ...skin.weaponSlotChanges[slot.id] } : slot;
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

function renderBuiltInArmaments(shipJson, weapons, wings) {
    let counts = {
        ...Object.values(shipJson.builtInWeapons ?? {}).reduce((acc, id) => {
            acc[id] =
            {
                id: id,
                count: (acc[id]?.count ?? 0) + 1,
                type: "WEAPON"
            };
            return acc;
        }, {}),
        ...Object.values(shipJson.builtInWings ?? {}).reduce((acc, id) => {
            acc[id] =
            {
                id: id,
                count: (acc[id]?.count ?? 0) + 1,
                type: "WING"
            };
            return acc;
        }, {})
    }


    EL.armaments_list.innerHTML = "";
    for (const [key, item] of Object.entries(counts)) {
        let li;
        if (item.type == "WEAPON")
            li = make(`<span>${item.count}x</span> ${capitalize(weapons.find(s => s.id == item.id).name)}`, 'li');
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

function handleNoScrollBar() {
    document.querySelectorAll(".simplebar-track").forEach(e => e.classList.add("d-none"));
}

function handleNoBorder() {
    document.querySelectorAll(".codex-border").forEach(e => e.classList.remove("codex-border"));
}

function handleNoShareIcon() {
    document.querySelector(".share").classList.add("d-none")
}

//#endregion

//#region toaster

function showToaster(title, text, img = "") {
    const toaster = EL.toaster;
    const toaster_image = EL.toaster_image;
    const toaster_title = EL.toaster_title;
    const toaster_text = EL.toaster_text;

    toaster_title.innerText = title;
    toaster_text.innerText = text;

    // @ts-ignore
    toaster_image.src = img;

    toaster.style.right = "0px";

    setTimeout(() => {
        toaster.style.right = "-274px";
    }, 5000);
}

window.showToaster = showToaster;

//#endregion
