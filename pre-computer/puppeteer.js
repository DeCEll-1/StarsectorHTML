const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:8080/index.html';

const OUTPUT_DIR = path.resolve(__dirname, '../AutoGen/Embeds');
const IDS = [
    "afflictor",
    "anubis",
    "apex",
    "apogee",
    "assault_unit",
    "astral",
    "atlas",
    "atlas2",
    "aurora",
    "bastillon",
    "berserker",
    "brawler",
    "brilliant",
    "buffalo2",
    "buffalo",
    "centurion",
    "champion",
    "colossus",
    "colossus2",
    "colossus3",
    "condor",
    "conquest",
    "crig",
    "defender",
    "station_derelict_survey_mothership",
    "dominator",
    "doom",
    "dram",
    "drover",
    "eagle",
    "enforcer",
    "eradicator",
    "fabricator_unit",
    "falcon",
    "fulgent",
    "fury",
    "gargoyle",
    "gemini",
    "glimmer",
    "gremlin",
    "grendel",
    "gryphon",
    "guardian",
    "hammerhead",
    "harbinger",
    "hermes",
    "heron",
    "hive_unit",
    "hound",
    "hyperion",
    "invictus",
    "kite",
    "lasher",
    "legion",
    "lumen",
    "manticore",
    "medusa",
    "mercury",
    "merlon",
    "monitor",
    "mora",
    "mudskipper",
    "mule",
    "nebula",
    "nova",
    "odyssey",
    "omen",
    "onslaught_mk1",
    "onslaught",
    "overseer_unit",
    "ox",
    "paragon",
    "pegasus",
    "phaeton",
    "phantom",
    "picket",
    "prometheus",
    "prometheus2",
    "radiant",
    "rampart",
    "ravelin",
    "remnant_station2",
    "retribution",
    "revenant",
    "scarab",
    "scintilla",
    "sentry",
    "shade",
    "shepherd",
    "shrike",
    "shrouded_eye",
    "shrouded_maelstrom",
    "shrouded_maw",
    "shrouded_tendril",
    "shuttlepod",
    "skirmish_unit",
    "standoff_unit",
    "starliner",
    "station1_hightech",
    "station1_midline",
    "station1",
    "station2_hightech",
    "station2_midline",
    "station2",
    "station3_hightech",
    "station3_midline",
    "station3",
    "sunder",
    "tarsus",
    "tempest",
    "valkyrie",
    "vanguard",
    "venture",
    "vigilance",
    "warden",
    "cerberus",
    "wayfarer",
    "wolf",
    "ziggurat",
    "afflictor_d_pirates",
    "brawler_LG",
    "brawler_pather",
    "brawler_tritachyon",
    "buffalo_hegemony",
    "buffalo_luddic_church",
    "buffalo_pirates",
    "buffalo_tritachyon",
    "centurion_LG",
    "cerberus_d_pirates",
    "cerberus_luddic_path",
    "dominator_xiv",
    "eagle_LG",
    "eagle_xiv",
    "enforcer_d_pirates",
    "enforcer_xiv",
    "eradicator_pirates",
    "executor",
    "falcon_LG",
    "falcon_p",
    "falcon_xiv",
    "gremlin_d_pirates",
    "gremlin_luddic_path",
    "hammerhead_LG",
    "hound_d_pirates",
    "hound_hegemony",
    "hound_luddic_church",
    "hound_luddic_path",
    "kite_hegemony",
    "kite_luddic_path",
    "kite_original",
    "kite_pirates",
    "lasher_luddic_church",
    "lasher_pather",
    "legion_xiv",
    "manticore_luddic_path",
    "manticore_pirates",
    "mercury_d",
    "mudskipper2",
    "mule_d_pirates",
    "onslaught_xiv",
    "shade_d_pirates",
    "shrike_pirates",
    "sunder_LG",
    "vanguard_pirates",
    "venture_p",
    "venture_pather",
    "wolf_d_pirates",
    "wolf_hegemony",
]

function firstNonEmpty(...vals) { return vals.find(v => v != null && v !== "") ?? "Unknown"; }


// @ts-ignore
const BOX_SELECTOR = '#codex';
const IMAGE_WIDTH = 836;
const IMAGE_HEIGHT = 736;

(async () => {
    // Create output folder
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        deviceScaleFactor: 1,
    });

    let template = (await fs.readFileSync(path.resolve(__dirname, './template.html'))).toString().replaceAll("\r\n", "\r\n\t");

    console.log(`Generating ${IDS.length} images using template:\n\n${template}\n\n`);


    const url = `${BASE_URL}?no_scroll_bar&no_search&no_share_icon`;

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    let i = 0;
    for (const id of IDS) {
        if (
            (await fs.existsSync(path.join(OUTPUT_DIR, `${id}.png`))) &&
            (await fs.existsSync(path.join(OUTPUT_DIR, `${id}.html`)))
        ) {
            console.log(`→ [${i}/${IDS.length}] - ${id} already exists… Skipping…`);
            await new Promise(r => setTimeout(r, 5));
            i++;
            continue;
        }
        console.log(`→ [${i}/${IDS.length}] - ${id}…`);

        console.log(`\t\t\tcalling updateCodex…`);
        let entry =
            await page.evaluate(id => {
                return window.updateCodex(id)
            }, id);

        // wait for site to update
        await new Promise(r => setTimeout(r, 500));

        //#region image
        console.log(`\t\t\ttaking screenshot…`);
        const screenshot = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
            },
        });


        console.log(`\t\t\twriting screenshot to file…`);
        const outPathImg = path.join(OUTPUT_DIR, `${id}.png`);
        fs.writeFileSync(outPathImg, screenshot);

        //#endregion

        //#region html

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
                )
        );

        //#endregion

        i++;
    }
    await browser.close();
    console.log('done');
})();