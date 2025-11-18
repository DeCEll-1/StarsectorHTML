// @ts-nocheck
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:8080/';

const OUTPUT_DIR = path.resolve(__dirname, '../../StarsectorHTMLEmbeds/AutoGen/Embeds');
const IDS = ['afflictor', 'afflictor_d_pirates', 'w_w_alc', 'w_w_alcp', 'swp_alastor', 'swp_alastor_lions_guard', 'swp_alastor_xiv', 'swp_albatross', 'sotf_anamnesis', 'anubis', 'apex', 'apogee', 'vayra_apogee_rm', 'ass_apogee_P', 'ass_aproach', 'swp_arachne', 'swp_archer', 'vayra_archimandrite', 'swp_archon', 'swp_boss_onslaught', 'hhe_artificer', 'hhe_astral_culann', 'ass_buffatlas', 'ass_aurora_pirates', 'vayra_aurora_ai', 'vayra_aurora_ak', 'vayra_heavy_drone_tender', 'vayra_badger_p', 'rwc_barrage', 'sotf_bastillon_aux', 'vayra_bear', 'swp_beholder', 'sotf_berserker_aux', 'ass_OrionDestroyer', 'swp_boss_brawler', 'ass_brawler_orth', 'ass_brawler_TT_P', 'swp_brawler_hegemony', 'brawler_LG', 'brawler_pather', 'brawler_tritachyon', 'ass_brawler_P', 'ass_brightshell', 'w_w_brow', 'vayra_bruiser', 'vayra_bruiser_lc', 'vayra_bruiser_lp', 'swp_buffalo_diktat', 'swp_buffalo_luddic_path', 'buffalo_hegemony', 'buffalo_luddic_church', 'buffalo_pirates', 'buffalo_tritachyon', 'vayra_buffalo_lc', 'vayra_buffalo_rg', 'vayra_buffalo_xiv', 'w_w_bugbear', 'vayra_buzzard', 'swp_caliber', 'vayra_camel', 'nes_carnelian', 'swp_boss_tarsus', 'swp_cathedral', 'swp_notredame', 'sotf_cavalier', 'ass_centurion_orth', 'ass_centurion_pather', 'swp_centurion_xiv', 'centurion_LG', 'vayra_centurion_warhawk', 'cerberus', 'ass_cerberus_modern', 'cerberus_d_pirates', 'cerberus_luddic_path', 'vayra_cerberus_mm', 'vayra_cerberus_rm', 'sotf_champion_warhorn', 'swp_champion_lions_guard', 'ass_champion_P', 'swp_chronos', 'swp_circe', 'vayra_clairvoyant', 'ass_clapper', 'swp_boss_phaeton', 'vayra_colossus_xiv', 'swp_condor_luddic_path', 'swp_conquest_lions_guard', 'swp_conquest_xiv', 'ass_crackshot', 'ass_cropthrough', 'swp_boss_aurora', 'ass_deejay', 'assault_unit', 'astral', 'atlas', 'atlas2', 'aurora', 'bastillon', 'berserker', 'brawler', 'brilliant', 'buffalo', 'buffalo2', 'centurion', 'champion', 'colossus', 'colossus2', 'colossus3', 'condor', 'conquest', 'defender', 'ass_mining_cerby', 'ass_mining_cerby_mkII', 'vayra_direwolf', 'ass_doink', 'vayra_dolphin', 'dominator', 'dominator_xiv', 'vayra_dominator_kazeron', 'vayra_dominator_rg', 'swp_boss_dominator_luddic_path', 'doom', 'dram', 'swp_dram_luddic_path', 'drover', 'vayra_drover_warhawk', 'eagle', 'rwc_eagle_ii', 'swp_eagle_black', 'swp_eagle_white', 'eagle_LG', 'eagle_xiv', 'vayra_eagle_warhawk', 'vayra_eagle_westernesse', 'rwc_eagle_ii', 'rwc_egret', 'swp_boss_beholder', 'swp_boss_dominator', 'sotf_lidarnode_mines', 'enforcer', 'swp_enforcer_luddic_path', 'enforcer_d_pirates', 'enforcer_xiv', 'swp_eos', 'sc_epitome', 'eradicator', 'eradicator_pirates', 'swp_boss_euryale', 'swp_excelsior', 'swp_excelsior_boss', 'swp_excelsior_elyon', 'swp_excelsior_locked', 'swp_excelsior_reward', 'vayra_exemplar', 'vayra_falchion', 'ass_falcon_TT_P', 'ass_falcon_TT', 'falcon_LG', 'falcon_p', 'falcon_xiv', 'vayra_falcon_warhawk', 'ass_featherblade', 'ass_grappler_P', 'ass_flame', 'ass_Fleek', 'nes_fluorspar', 'swp_boss_sunder', 'swp_boss_frankenstein', 'vayra_galleon', 'vayra_galleon_p', 'gargoyle', 'gemini', 'vayra_gemini_mm', 'hhe_gemini', 'ass_gigadeath', 'glimmer', 'vayra_golden_eagle', 'vayra_golem', 'swp_boss_medusa', 'gremlin', 'gremlin_d_pirates', 'gremlin_luddic_path', 'grendel', 'vayra_greyhound', 'vayra_groundhog', 'ass_lowtech_tempest', 'ass_gryphlet_LG', 'gryphon', 'swp_gryphon_xiv', 'guardian', 'swp_boss_cerberus', 'vayra_hail', 'nes_hammerfall', 'nes_hammerfall_pirates', 'hammerhead', 'swp_hammerhead_xiv', 'hammerhead_LG', 'vayra_hammerhead_rg', 'vayra_hammerhead_warhawk', 'nes_hampter', 'nes_hampter_pirates', 'nes_hampter_xiv', 'sotf_empl_t2_ht', 'sotf_empl_t2_lt', 'sotf_gunturret', 'sotf_cavalier_aux', 'test_conqueror', 'sotf_defender_aux', 'test_egret', 'nes_hampter_hero', 'harbinger', 'sotf_harbinger_warhorn', 'vayra_hatchetman', 'vayra_hatchetman_lp', 'swp_hecate', 'vayra_henchman', 'hermes', 'ass_hermes_mkII', 'w_w_hermesmkii', 'w_w_hermesmklp', 'w_w_hermesmkp', 'nes_hermitaur', 'nes_hermitaur_path', 'nes_hermitaur_pirates', 'heron', 'vayra_heron_warhawk', 'ass_hilltop', 'ass_miningmech', 'sc_horizon', 'ass_hound_modern', 'hound_d_pirates', 'hound_hegemony', 'hound_luddic_church', 'hound_luddic_path', 'vayra_hound_mm', 'rwc_hrunting', 'vayra_huntress', 'rwc_hurricane', 'vayra_hyena', 'ass_hyperfrigate', 'w_w_igneon', 'swp_boss_odyssey', 'vayra_intimidator', 'vayra_intimidator_lc', 'rwc_javelin', 'ass_jest', 'ass_junka', 'sotf_keeper', 'swp_boss_eagle', 'vayra_kingfisher', 'kite_hegemony', 'kite_luddic_path', 'kite_original', 'kite_pirates', 'swp_lasher_xiv', 'lasher_luddic_church', 'lasher_pather', 'vayra_lasher_rg', 'legion_xiv', 'w_w_leprechaun', 'swp_boss_atlas', 'swp_liberator', 'ass_corvetteAmmo', 'ass_littlebirdie_pirates', 'w_w_lum', 'vayra_manifesto', 'manticore_luddic_path', 'manticore_pirates', 'w_w_mat', 'ass_medusa_pirates', 'vayra_medusa_ai', 'vayra_medusa_ak', 'vayra_mendicant', 'mercury_d', 'vayra_monitor_rg', 'vayra_mora_rg', 'mudskipper2', 'vayra_mudskipper_xiv', 'mule_d_pirates', 'vayra_mule_mm', 'vayra_mule_rm', 'w_w_nyala', 'onslaught_xiv', 'vayra_oppressor', 'vayra_oppressor_lc', 'sc_outrider', 'vayra_pathfinder', 'executor', 'vayra_persecutor', 'vayra_persecutor_lp', 'vayra_pinnacle', 'vayra_pioneer', 'w_w_pitman', 'vayra_prophet', 'vayra_prophet_lp', 'vayra_prospector', 'vayra_razorback', 'w_w_ribaldo', 'vayra_mining_hound', 'vayra_ruin', 'vayra_rukh', 'crig', 'fabricator_unit', 'falcon', 'fury', 'hive_unit', 'hound', 'hyperion', 'invictus', 'kite', 'lasher', 'legion', 'swp_liberator_luddic_church', 'ass_littlebirdie', 'swp_boss_doom', 'lumen', 'ass_beamDestroyer', 'ass_beamDestroyer_X', 'manticore', 'medusa', 'mercury', 'ass_mercury_mkII', 'merlon', 'monitor', 'mora', 'ass_mora_P', 'mudskipper', 'mule', 'swp_nautilus', 'nebula', 'swp_nebula_luddic_path', 'ass_nightlord', 'swp_nightwalker', 'swp_boss_conquest', 'odyssey', 'omen', 'onslaught', 'swp_boss_onslaught_luddic_path', 'onslaught_mk1', 'onslaught_beam', 'ass_oomer', 'swp_boss_hammerhead', 'ass_pinetree', 'rwc_polaris', 'swp_boss_mule', 'ass_junkDestroyer', 'ass_profanity', 'ass_profanity_P', 'swp_punisher', 'ass_weaponswapFrigate', 'swp_boss_falcon', 'swp_boss_excelsior', 'swp_boss_lasher_r', 'ass_scarab_pirates', 'ass_junkCruiser', 'vayra_seer', 'hhe_sentinel', 'vayra_seraph', 'shade_d_pirates', 'ass_shepherd_P', 'vayra_shepherd_rg', 'ass_ludmech', 'swp_shimmer', 'vayra_shirdal', 'shrike_pirates', 'vayra_shrike_ak', 'vayra_shrike_rm', 'ass_spacemech', 'vayra_sirocco', 'ass_tauntfrigate', 'ass_slur_pirates', 'swp_solar', 'vayra_spade', 'vayra_sphinx', 'ass_stormcaster', 'ass_hightechmonitor1', 'swp_striker', 'swp_striker_luddic_church', 'vayra_subjugator', 'vayra_subjugator_lp', 'vayra_sunbird', 'swp_sunder_xiv', 'sunder_LG', 'vayra_sunder_warhawk', 'swp_sunder_u', 'ass_supercrusher', 'vayra_swordsman', 'vayra_targe', 'vayra_targe_lp', 'vayra_tarsus_ii', 'vayra_tempest_ai', 'swp_boss_shade', 'swp_boss_afflictor', 'vayra_hegbinger', 'hhe_tribunal', 'rwc_triumphant', 'vayra_typhon', 'vayra_tyrant', 'vayra_tyrant_lp', 'ass_undertaker', 'swp_boss_lasher_b', 'vanguard_pirates', 'w_w_vaq', 'venture_p', 'venture_pather', 'vayra_venture_mm', 'ass_vexate', 'vigilance', 'swp_vigilance_lions_guard', 'ass_vigilance_LP', 'rwc_viking', 'rwc_viper', 'nes_voltaire', 'sotf_vow', 'sotf_vow_siren', 'rwc_vulcan', 'swp_boss_sporeship', 'swp_victory', 'swp_vindicator', 'swp_vindicator_o', 'swp_vortex', 'swp_vulture', 'swp_vulture_lions_guard', 'swp_vulture_p', 'swp_wall', 'warden', 'sotf_warden_aux', 'w_w_warfarer', 'rwc_warhawk', 'ass_warmule', 'wayfarer', 'vayra_wayfarer_rm', 'ass_grappler', 'sotf_autohangar', 'sotf_lidarnode', 'sotf_memoir', 'sotf_pact', 'sotf_picket_aux', 'sotf_pledge', 'sotf_rampart_aux', 'sotf_repose', 'sotf_respite', 'sotf_sentry_aux', 'sotf_thorn', 'ass_eagle_AS', 'ass_whitetail', 'ass_whitetail_LG', 'wolf', 'swp_wolf_luddic_path', 'wolf_d_pirates', 'wolf_hegemony', 'vayra_wolf_rm', 'sc_yonder', 'swp_zenith', 'swp_boss_paragon', 'overseer_unit', 'ox', 'paragon', 'pegasus', 'phaeton', 'phantom', 'picket', 'prometheus', 'prometheus2', 'rampart', 'ravelin', 'retribution', 'revenant', 'scarab', 'sentry', 'shade', 'shepherd', 'shrike', 'shrouded_eye', 'shrouded_maelstrom', 'shrouded_maw', 'shrouded_tendril', 'shuttlepod', 'skirmish_unit', 'standoff_unit', 'starliner', 'sunder', 'tarsus', 'tempest', 'valkyrie', 'vanguard', 'venture', 'ziggurat', 'vayra_ziz', 'Stations', 'station2_hightech', 'station2_midline', 'station2', 'station_derelict_survey_mothership', 'station1_hightech', 'station1_midline', 'station1', 'remnant_station2', 'sotf_sanctum_upgraded', 'station3_hightech', 'station3_midline', 'station3', 'Weapons', 'abyssal_glare', 'swp_tripleflak', 'annihilator', 'annihilatorpod', 'vayra_annihilator_rack', 'ass_annihilatorXL', 'amblaster', 'amsrm', 'arbalest', 'ass_repairmoduleS', 'ass_repairmoduleM', 'ass_armormortarS', 'chaingun', 'ass_heavyassaultchaingun', 'atropos_single', 'atropos', 'autopulsebeam', 'autopulse', 'ass_exoBurst', 'sotf_barbmount', 'sotf_barbrail', 'ass_baikal', 'ass_exo_flamer', 'ass_blackdisco', 'ass_recoilless', 'ass_luddicblaster', 'ass_flamelance_small', 'ass_exoGrenade', 'breach', 'ass_breach_barrage', 'breachpod', 'vayra_burst_ciws', 'pdburst', 'vayra_canister_gun', 'vayra_rod_launcher', 'ass_nukelance', 'sotf_chalice', 'vayra_med_chemrail', 'vortex_launcher', 'swp_contender', 'vayra_biorifle', 'cryoblaster', 'cryoflux', 'vayra_splintergun', 'vayra_splintermirv', 'vayra_ioncycler', 'cyclone', 'devouring_swarm', 'vayra_degraded_particle_beam', 'ass_deRealizer', 'antediluvian_torpedo_launcher', 'devastation', 'ass_devastatormissileLauncher', 'devastator', 'disintegrator', 'dragon', 'dragonpod', 'dualflak', 'vayra_dual_ciws_beam', 'sotf_edict', 'ass_external_cargoL', 'ass_external_cargoM', 'ass_external_flux', 'ass_fissionpulser', 'vayra_ercannon', 'vayra_strikecannon', 'flak', 'swp_flareburst', 'swp_flaregun', 'rwc_flash', 'rwc_flash_l', 'rwc_flash_m', 'w_w_flintlock', 'vayra_frag_scatter', 'gauss', 'gazer', 'gazerpod', 'gigacannon', 'gorgon', 'gorgonpod', 'ass_flamelance', 'gravitonbeam', 'vayra_grav_blaster', 'w_w_grav_blaster', 'ass_reaper', 'ass_gryezeeys', 'vayra_rocket_gun', 'hammerrack', 'vayra_hammer_pod', 'hammer', 'hammer_single', 'harpoon', 'harpoon_single', 'ass_harpoon_single', 'rwc_harpoon_lrg', 'harpoonpod', 'vayra_harvester_rack', 'vayra_hauberk_ciws', 'ass_heavensmace', 'ass_armormortarM', 'heavyac', 'heavyblaster', 'heavyburst', 'ass_heavy_gryezeeys', 'swp_ionblaster', 'vayra_sabot_battery', 'heavymg', 'ass_heavymg_LP', 'heavy_mass_driver', 'heavymauler', 'heavymortar', 'heavyneedler', 'vayra_heavy_cutter', 'rwc_positron', 'ass_phasecl', 'ass_flameMedium', 'hhe_heavyvulcan', 'hellbore', 'hephag', 'ass_hghfhghfjghf', 'hil', 'swp_hornet', 'assaying_rift', 'hurricane', 'hydra', 'hveldriver', 'vayra_microimpulsor', 'swp_inferno', 'inimical_emanation', 'ionbeam', 'ioncannon', 'ionpulser', 'vayra_ion_scatterer', 'ass_shieldbuster', 'swp_iontorpedo', 'irautolance', 'hhe_ir_autopulse', 'irpulse', 'vayra_spike_battery', 'vayra_spike_pod', 'jackhammer', 'vayra_jahannam', 'vayra_jamadhar_pod', 'vayra_jamadhar_rack', 'vayra_srm_4', 'vayra_vlrms_med', 'vayra_vlrms_large', 'vayra_lightspike_pod', 'vayra_jericho_sml', 'vayra_jericho_med', 'vayra_jericho_lrg', 'vayra_light_flechette', 'vayra_spike_torpedo_small', 'vayra_spike_torpedo_medium', 'vayra_jinn', 'vayra_joachim', 'vayra_aam_med', 'vayra_kashtan', 'ass_smallKEEnergy', 'kineticblaster', 'kinetic_fragments', 'nes_assault_mjolnir', 'sotf_lethargy', 'lightag', 'lightac', 'vayra_light_chemrail', 'ass_lightCRAM', 'lightdualac', 'lightdualmg', 'ass_lightdualmg_LP', 'hhe_ftr_ion_lance_light', 'lightmg', 'light_mass_driver', 'rwc_light_mjolnir', 'lightmortar', 'lightneedler', 'swp_lightphaselance', 'vayra_light_cutter', 'swp_lightninggun', 'ass_litterer', 'ass_litterer_heavy', 'locust', 'w_w_lrmining', 'lrpdlaser', 'vayra_degraded_pulselaser', 'ass_magicMissile', 'mark9', 'w_w_matchlock', 'vayra_combat_laser', 'sotf_mercy', 'swp_microblaster', 'swp_microblaster_array', 'miningblaster', 'w_w_mininglance', 'mininglaser', 'minipulser', 'mjolnir', 'test_mjolnir', 'vayra_multirail', 'neoferric_quadcoil', 'sotf_nettlerail', 'neutron_torpedo', 'guardian', 'vayra_particle_beam', 'pdlaser', 'hhe_pdpulser', 'hhe_pdlaserstreamer', 'vayra_phase_blaster', 'phasebeam', 'rwc_tribeam', 'rwc_railcannon', 'pilum_large', 'pilum', 'plasmabeam', 'plasma', 'swp_plasmaflame', 'ass_smallplasma', 'vayra_antimatterpulse', 'rwc_positron_m', 'vayra_precision_mortar', 'antediluvian_pressure_gun', 'hhe_prickler', 'phasecl', 'pseudoparticle_jet', 'ass_gravitonbeam', 'pulselaser', 'hhe_pulsephaser', 'railgun', 'realitydisruptor', 'reaper', 'sotf_reckoner', 'antediluvian_reflector', 'swp_reliant', 'resonatormrm', 'riftbeam', 'riftcascade', 'riftlance', 'rift_lightning', 'rifttorpedo', 'vayra_light_ciws_beam', 'sabot', 'sabot_single', 'ass_sabot4x', 'sabotpod', 'heatseeker', 'salamanderpod', 'ass_seal', 'ass_seal_pod', 'ass_seal_barrage', 'seeker_fragment', 'ass_flameSmall', 'ass_shaaweeys_small', 'ass_shaaweeys', 'shockrepeater', 'vayra_shockweb', 'vayra_shortcircuit_driver', 'ass_piratechaingun', 'hhe_shrieker', 'w_w_slt_med', 'w_w_slt_large', 'w_w_slt', 'w_w_slt_sing', 'vayra_sling', 'antediluvian_solon_blaster', 'ass_cyclone', 'ass_sower', 'squall', 'ass_exo_stakeSwarm', 'bomb', 'w_w_stewart', 'multineedler', 'ass_ssmg', 'swarm_launcher', 'swarmer', 'test_tachyon_accelerator', 'tachyonlance', 'taclaser', 'ass_quaker', 'shredder', 'ass_thunderstriker', 'swp_tornado', 'swp_trebuchet', 'typhoon', 'ass_typhoon', 'ass_uke', 'vayra_heavy_chemrail', 'unstable_fragment', 'ass_heavypulselaser', 'voidblaster', 'vpdriver', 'vayra_volley_gun', 'voltaic_cannon', 'voltaic_discharge', 'vulcan', 'w_w_wheellock', 'ass_supermodular_superM', 'ass_supermodular_superL', 'ass_supermodular_superS']

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
    // const context = await browser.createIncognitoBrowserContext();
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        deviceScaleFactor: sf,
    });

    let template = (await fs.readFileSync(path.resolve(__dirname, './template.html'))).toString().replaceAll("\r\n", "\r\n\t");

    console.log(`Generating ${IDS.length - 2} images using template:\n\n${template}\n\n`);


    const url = `${BASE_URL}?no_search&no_mod_list&no_lower_content&no_share_icon&no_scroll_bar&no_toaster`;
    await page.setCacheEnabled(false)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1000));
    let i = 0;
    let category = "Ships"
    for (const id of IDS) {
        const imgExists = (await fs.existsSync(path.join(OUTPUT_DIR, `${id}_${category}.png`)));
        const htmlExists = (await fs.existsSync(path.join(OUTPUT_DIR, `${id}_${category}.html`)));
        if (
            imgExists &&
            htmlExists
        ) { // 3 cuz stations + ships
            console.log(`→ [${i}/${IDS.length - 3}] - ${id}_${category} already exists… Skipping…`);
            await new Promise(r => setTimeout(r, 1));
            i++;
            continue;
        }
        console.log(`→ [${i}/${IDS.length - 3}] - ${id}…`);

        console.log(`\t\t\tcalling updateCodex…`);
        if (["Ships", "Stations", "Weapons"].includes(id)) {
            category = await page.evaluate((id) => {
                changeSearchCategory(id)
                return search_category
            }, id)
            continue;
        }

        let entry =
            await page.evaluate(id => {
                const res = window.updateCodex(id)
                window.handleParams();
                return res;
            }, id);


        //#region image

        if (!imgExists) {
            // wait for site to update

            const imgSelector = "#image";

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
            const outPathImg = path.join(OUTPUT_DIR, `${id}_${category}.png`);
            fs.writeFileSync(outPathImg, screenshot);
        }

        //#endregion

        //#region html

        if (!htmlExists) {
            console.log(`\t\t\twriting html to file …`);
            const outPathHtml = path.join(OUTPUT_DIR, `${id}_${category}.html`);
            function writeShipHTML(category) {
                const lore = ((entry.skin?.descriptionPrefix ?? "") + "\n\n" + entry.description?.text1?.split("\r\n")[0]);
                fs.writeFileSync(outPathHtml,
                    template
                        .replaceAll("{TITLE}",
                            `${firstNonEmpty(entry.skin?.hullName, entry.csv.name)}-class ${firstNonEmpty(entry.skin?.hullDesignation, entry.csv?.designation)}`
                        ).replaceAll("{SEARCH_ID}",
                            id
                        ).replaceAll("{COLOR}",
                            entry.color.hex
                        ).replaceAll("{SEARCH_TEXT}",
                            firstNonEmpty(entry.skin?.hullName, entry.csv.name)
                        ).replaceAll("{DESCRIPTION}",
                            (lore.length > 150) ? lore.substring(0, lore.indexOf(".", 150) + 1) : lore
                        ).replaceAll("{CATEGORY}",
                            category
                        )
                );
            }

            function writeWeaponHTML() {
                const lore = entry.description?.text1?.split("\r\n")[0];
                fs.writeFileSync(outPathHtml,
                    template
                        .replaceAll("{TITLE}",
                            entry.weapon_data.name
                        ).replaceAll("{SEARCH_ID}",
                            id
                        ).replaceAll("{COLOR}",
                            entry.color.hex
                        ).replaceAll("{SEARCH_TEXT}",
                            entry.weapon_data.name
                        ).replaceAll("{DESCRIPTION}",
                            (lore.length > 150) ? lore.substring(0, lore.indexOf(".", 150) + 1) : lore
                        ).replaceAll("{CATEGORY}",
                            "Weapons"
                        )
                );
            }

            switch (category) {
                case "Ships": writeShipHTML("Ships"); break;
                case "Stations": writeShipHTML("Stations"); break;
                case "Weapons": writeWeaponHTML(); break;
                default: break;
            }

        }

        //#endregion

        i++;
    }
    await browser.close();
    console.log('done');
})();