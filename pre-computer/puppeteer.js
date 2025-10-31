const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:8080/index.html';

const OUTPUT_DIR = path.resolve(__dirname, '../AutoGen/Embeds');
const IDS = ["ass_apogee_P", "ass_aproach", "ass_beamDestroyer_X", "ass_beamDestroyer", "ass_brawler_P", "ass_brightshell", "ass_buffatlas", "ass_champion_P", "ass_clapper", "ass_corvetteAmmo", "ass_crackshot", "ass_cropthrough", "ass_deejay", "ass_doink", "ass_eagle_AS", "ass_featherblade", "ass_flame", "ass_Fleek", "ass_gigadeath", "ass_grappler_P", "ass_grappler", "ass_hermes_mkII", "ass_hightechmonitor1", "ass_hilltop", "ass_hyperfrigate", "ass_jest", "ass_junka", "ass_junkCruiser", "ass_junkDestroyer", "ass_littlebirdie", "ass_lowtech_tempest", "ass_ludmech", "ass_mercury_mkII", "ass_mining_cerby_mkII", "ass_mining_cerby", "ass_miningmech", "ass_mora_P", "ass_nightlord", "ass_oomer", "ass_OrionDestroyer", "ass_pinetree", "ass_profanity_P", "ass_profanity", "ass_spacemech", "ass_stormcaster", "ass_supercrusher", "ass_tauntfrigate", "ass_undertaker", "ass_vexate", "ass_vigilance_LP", "ass_warmule", "ass_weaponswapFrigate", "ass_whitetail_LG", "afflictor", "anubis", "apex", "apogee", "assault_unit", "astral", "atlas", "atlas2", "aurora", "bastillon", "berserker", "brawler", "brilliant", "buffalo2", "buffalo", "centurion", "champion", "colossus", "colossus2", "colossus3", "condor", "conquest", "crig", "defender", "station_derelict_survey_mothership", "dominator", "doom", "dram", "drover", "eagle", "enforcer", "eradicator", "fabricator_unit", "falcon", "fulgent", "fury", "gargoyle", "gemini", "glimmer", "gremlin", "grendel", "gryphon", "guardian", "hammerhead", "harbinger", "hermes", "heron", "hive_unit", "hound", "hyperion", "invictus", "kite", "lasher", "legion", "lumen", "manticore", "medusa", "mercury", "merlon", "monitor", "mora", "mudskipper", "mule", "nebula", "nova", "odyssey", "omen", "onslaught_mk1", "onslaught", "overseer_unit", "ox", "paragon", "pegasus", "phaeton", "phantom", "picket", "prometheus", "prometheus2", "radiant", "rampart", "ravelin", "remnant_station2", "retribution", "revenant", "scarab", "scintilla", "sentry", "shade", "shepherd", "shrike", "shrouded_eye", "shrouded_maelstrom", "shrouded_maw", "shrouded_tendril", "shuttlepod", "skirmish_unit", "standoff_unit", "starliner", "station1_hightech", "station1_midline", "station1", "station2_hightech", "station2_midline", "station2", "station3_hightech", "station3_midline", "station3", "sunder", "tarsus", "tempest", "valkyrie", "vanguard", "venture", "vigilance", "warden", "cerberus", "wayfarer", "wolf", "ziggurat", "vayra_archimandrite", "vayra_badger_p", "vayra_bear", "vayra_bruiser", "vayra_buzzard", "vayra_camel", "vayra_clairvoyant", "vayra_direwolf", "vayra_dolphin", "vayra_exemplar", "vayra_falchion", "vayra_galleon", "vayra_golden_eagle", "vayra_golem", "vayra_greyhound", "vayra_groundhog", "vayra_hail", "vayra_hammerhead_warhawk", "vayra_hatchetman", "vayra_heavy_drone_tender", "vayra_hegbinger", "vayra_henchman", "vayra_huntress", "vayra_hyena", "vayra_intimidator", "vayra_kingfisher", "vayra_manifesto", "vayra_mendicant", "vayra_mining_hound", "vayra_oppressor", "vayra_pathfinder", "vayra_persecutor", "vayra_pinnacle", "vayra_pioneer", "vayra_prophet", "vayra_prospector", "vayra_razorback", "vayra_ruin", "vayra_rukh", "vayra_seer", "vayra_seraph", "vayra_shirdal", "vayra_sirocco", "vayra_spade", "vayra_sphinx", "vayra_subjugator", "vayra_sunbird", "vayra_swordsman", "vayra_targe", "vayra_tarsus_ii", "vayra_typhon", "vayra_tyrant", "vayra_ziz", "ass_aurora_pirates", "ass_brawler_orth", "ass_brawler_TT_P", "ass_centurion_orth", "ass_centurion_pather", "ass_cerberus_modern", "ass_falcon_TT_P", "ass_falcon_TT", "ass_gryphlet_LG", "ass_hound_modern", "ass_littlebirdie_pirates", "ass_medusa_pirates", "ass_scarab_pirates", "ass_shepherd_P", "ass_slur_pirates", "ass_whitetail", "afflictor_d_pirates", "brawler_LG", "brawler_pather", "brawler_tritachyon", "buffalo_hegemony", "buffalo_luddic_church", "buffalo_pirates", "buffalo_tritachyon", "centurion_LG", "cerberus_d_pirates", "cerberus_luddic_path", "dominator_xiv", "eagle_LG", "eagle_xiv", "enforcer_d_pirates", "enforcer_xiv", "eradicator_pirates", "executor", "falcon_LG", "falcon_p", "falcon_xiv", "gremlin_d_pirates", "gremlin_luddic_path", "hammerhead_LG", "hound_d_pirates", "hound_hegemony", "hound_luddic_church", "hound_luddic_path", "kite_hegemony", "kite_luddic_path", "kite_original", "kite_pirates", "lasher_luddic_church", "lasher_pather", "legion_xiv", "manticore_luddic_path", "manticore_pirates", "mercury_d", "mudskipper2", "mule_d_pirates", "onslaught_xiv", "shade_d_pirates", "shrike_pirates", "sunder_LG", "vanguard_pirates", "venture_p", "venture_pather", "wolf_d_pirates", "wolf_hegemony", "vayra_apogee_rm", "vayra_aurora_ai", "vayra_aurora_ak", "vayra_bruiser_lc", "vayra_bruiser_lp", "vayra_buffalo_lc", "vayra_buffalo_rg", "vayra_buffalo_xiv", "vayra_centurion_warhawk", "vayra_cerberus_mm", "vayra_cerberus_rm", "vayra_colossus_xiv", "vayra_dominator_kazeron", "vayra_dominator_rg", "vayra_drover_warhawk", "vayra_eagle_warhawk", "vayra_eagle_westernesse", "vayra_falcon_warhawk", "vayra_galleon_p", "vayra_gemini_mm", "vayra_hammerhead_rg", "vayra_hatchetman_lp", "vayra_heron_warhawk", "vayra_hound_mm", "vayra_intimidator_lc", "vayra_lasher_rg", "vayra_medusa_ai", "vayra_medusa_ak", "vayra_monitor_rg", "vayra_mora_rg", "vayra_mudskipper_xiv", "vayra_mule_mm", "vayra_mule_rm", "vayra_oppressor_lc", "vayra_persecutor_lp", "vayra_prophet_lp", "vayra_shepherd_rg", "vayra_shrike_ak", "vayra_shrike_rm", "vayra_subjugator_lp", "vayra_sunder_warhawk", "vayra_targe_lp", "vayra_tempest_ai", "vayra_tyrant_lp", "vayra_venture_mm", "vayra_wayfarer_rm", "vayra_wolf_rm"]

function firstNonEmpty(...vals) { return vals.find(v => v != null && v !== "") ?? "Unknown"; }


// @ts-ignore
const BOX_SELECTOR = '#codex';
const IMAGE_WIDTH = 836;
const IMAGE_HEIGHT = 434;
const sf = 1.5;

(async () => {
    // Create output folder
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        deviceScaleFactor: sf,
    });

    let template = (await fs.readFileSync(path.resolve(__dirname, './template.html'))).toString().replaceAll("\r\n", "\r\n\t");

    console.log(`Generating ${IDS.length} images using template:\n\n${template}\n\n`);


    const url = `${BASE_URL}?no_search&no_mod_list&no_lower_content&no_share_icon&no_scroll_bar`;

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1000));
    let i = 0;
    for (const id of IDS) {
        const imgExists = (await fs.existsSync(path.join(OUTPUT_DIR, `${id}.png`)));
        const htmlExists = (await fs.existsSync(path.join(OUTPUT_DIR, `${id}.html`)));
        if (
            imgExists &&
            htmlExists
        ) {
            console.log(`→ [${i}/${IDS.length - 1}] - ${id} already exists… Skipping…`);
            await new Promise(r => setTimeout(r, 5));
            i++;
            continue;
        }
        console.log(`→ [${i}/${IDS.length - 1}] - ${id}…`);

        console.log(`\t\t\tcalling updateCodex…`);
        let entry =
            await page.evaluate(id => {
                return window.updateCodex(id)
            }, id);

        //#region image

        if (!imgExists) {
            // wait for site to update
            // await new Promise(r => setTimeout(r, 700));

            const imgSelector = "#ship_image";

            await page.evaluate((selector) => {
                return new Promise((resolve) => {
                    const img = document.querySelector(selector);
                    if (img.complete) {
                        resolve(); // already loaded
                    } else {
                        img.onload = () => resolve();
                    }
                });
            }, imgSelector);

            console.log(`\t\t\ttaking screenshot…`);
            const screenshot = await page.screenshot();

            console.log(`\t\t\twriting screenshot to file…`);
            const outPathImg = path.join(OUTPUT_DIR, `${id}.png`);
            fs.writeFileSync(outPathImg, screenshot);
        }

        //#endregion

        //#region html

        if (!htmlExists) {
            console.log(`\t\t\twriting html to file …`);
            const outPathHtml = path.join(OUTPUT_DIR, `${id}.html`);
            fs.writeFileSync(outPathHtml,
                template
                    .replaceAll("{SHIP_NAME}",
                        `${firstNonEmpty(entry.skin?.hullName, entry.csv.name)}-class ${firstNonEmpty(entry.skin?.hullDesignation, entry.csv?.designation)}`
                    ).replaceAll("{SHIP_ID}",
                        id
                    ).replaceAll("{SHIP_COLOR}",
                        entry.color.hex
                    ).replaceAll("{SEARCH_TEXT}",
                        firstNonEmpty(entry.skin?.hullName, entry.csv.name)
                    )
            );
        }

        //#endregion

        i++;
    }
    await browser.close();
    console.log('done');
})();