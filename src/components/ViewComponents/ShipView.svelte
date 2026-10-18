<script lang="ts">
  import Enumerable from "linq";
  import { gameData } from "../../lib/GameData";
  import {
    capitalize,
    firstNonEmpty,
    resolve_mod_image_path,
  } from "../../lib/Utils";
  import WrapperView from "./WrapperView.svelte";
  import {
    getArmaments,
    getDefenseStats,
    getDescriptionLines,
    getHullmods,
    getShipByWingId,
    getSpritePath,
    getWeaponMounts,
  } from "../../lib/Views/ShipViewUtils";

  let {
    csv,
    ship,
    skin,
  }: {
    csv?: ShipCSV;
    ship?: ShipJSON;
    skin?: Skin;
  } = $props();

  let headerText = $derived.by(() => {
    return ship?.hullName;
  });

  let statsHeight = $state(0);
  let copied = $state(false);

  const sensorDict = { Frigate: 30, Destroyer: 60, Cruiser: 90, Capital: 150 };

  let shipView: ShipView | undefined = $derived.by(() => {
    if (!csv || !ship) return undefined;

    const hullSize = capitalize(ship.hullSize)
      .replace("_", " ")
      .replace("ship", "");
    const sensor = sensorDict[hullSize as keyof typeof sensorDict];

    const hasDefenseID = csv["defense id"] != "";
    const right_click_system = hasDefenseID
      ? gameData.ship_systems.find((s: any) => s.id === csv["defense id"])
      : undefined;

    const shieldType = csv["shield type"];
    const defenseStats = getDefenseStats(
      csv,
      shieldType,
      hasDefenseID,
      right_click_system,
    );

    const system = gameData.ship_systems.find(
      (s: System) => firstNonEmpty(skin?.systemId, csv["system id"]) == s.id,
    );
    const systemDesc = gameData.descriptions.find(
      (s: Description) => s.id == system?.id,
    )?.text1 ?? "undefined";

    const mounts = getWeaponMounts(ship, skin);
    const armaments = getArmaments(ship);
    const hullmods = getHullmods(ship, skin);

    const description = gameData.descriptions.find(
      (d: Description) =>
        d.id === firstNonEmpty(skin?.descriptionId, csv.id) &&
        d.type === "SHIP",
    );
    const descriptionLines = getDescriptionLines(description);
    const imagePath = getSpritePath(ship, skin);

    return {
      csv,
      ship,
      skin,
      right_click_system,
      crDeployment: csv["CR to deploy"],
      recoveryRate: csv["cr %/day"],
      recoveryCost: csv["supplies/rec"],
      deploymentPoints: csv["supplies/rec"],
      peakPerformanceTime: csv["peak CR sec"],
      hullSize,
      ordnancePoints: csv["ordnance points"],
      suppliesMonth: csv["supplies/mo"],
      cargoCap: csv.cargo,
      crewMax: csv["max crew"],
      crewMin: csv["min crew"],
      fuelCap: csv.fuel,
      burnMax: csv["max burn"],
      fuelCost: csv["fuel/ly"],
      sensorProfile: sensor,
      sensorStrength: sensor,
      hullIntegrity: csv.hitpoints,
      armorRating: csv["armor rating"],
      defenseType: right_click_system?.name ?? defenseStats.defenseType,
      defenseProperty1Name: defenseStats.prop1Name,
      defenseProperty1Val: defenseStats.prop1Val,
      defenseProperty2Name: defenseStats.prop2Name,
      defenseProperty2Val: defenseStats.prop2Val,
      defenseProperty3Name: defenseStats.prop3Name,
      defenseProperty3Val: defenseStats.prop3Val,
      fluxCap: csv["max flux"],
      fluxDiss: csv["flux dissipation"],
      speedMax: csv["max speed"],
      systemTitle: system?.name ?? "None",
      systemDescription: systemDesc,
      mounts,
      armaments,
      hullmods,
      designType: csv["tech/manufacturer"],
      designColor: gameData.colors[csv["tech/manufacturer"]],
      description: descriptionLines,
      price: (parseFloat(csv["base value"]) * (skin?.baseValueMult ?? 1.0))
        .toLocaleString("en-US", { style: "currency", currency: "EUR" })
        .slice(1),
      image: imagePath,
    };
  });
  $inspect(shipView);

  function copyLink() {
    copied = true;
    setInterval(() => {
      copied = false;
    }, 2500);
  }
</script>

<WrapperView {headerText}>
  <div class="item-view-content">
    <div class="d-flex mb-4 justify-space-around align-stretch">
      <div class="ship-stats" bind:clientHeight={statsHeight}>
        <!-- info -->
        <div class="d-flex stats-header center mb-4">
          <!-- logic -->
          <div class="d-block" style="width: 65%;">
            <div class="logistical-header header">Logistical data</div>
            <div class="logistical-content d-flex">
              <ul>
                <li>
                  CR per deployment
                  <span>{shipView?.crDeployment}</span>
                </li>
                <li>
                  &nbsp;Recovery (/ day)
                  <span>{shipView?.recoveryRate}</span>
                </li>
                <li>
                  &nbsp;Recovery (supplies)
                  <span>{shipView?.recoveryCost}</span>
                </li>
                <li>
                  &nbsp;Deployment points
                  <span class="stat-dp">{shipView?.deploymentPoints}</span>
                </li>
                <li>
                  Peak performance (sec)
                  <span class="stat-white">{shipView?.peakPerformanceTime}</span
                  >
                </li>
                <li>
                  Crew complement
                  <span class="stat-crew"
                    >{shipView?.crewMin} / {shipView?.crewMax}</span
                  >
                </li>
                <li>&nbsp;</li>
                <li>
                  Hull size
                  <span class="stat-yellow">{shipView?.hullSize}</span>
                </li>
                <li>
                  Ordnance points
                  <span class="stat-yellow">{shipView?.ordnancePoints}</span>
                </li>
              </ul>
              <ul>
                <li>
                  Maintenance (sup/mo)
                  <span>{shipView?.suppliesMonth}</span>
                </li>
                <li>
                  Cargo capacity
                  <span class="stat-cargo">{shipView?.cargoCap}</span>
                </li>
                <li>
                  Maximum crew
                  <span class="stat-crew">{shipView?.crewMax}</span>
                </li>
                <li>
                  Skeleton crew required
                  <span class="stat-crew">{shipView?.crewMin}</span>
                </li>
                <li>
                  Fuel capacity
                  <span class="stat-fuel">{shipView?.fuelCap}</span>
                </li>
                <li>
                  Maximum burn
                  <span class="stat-yellow">{shipView?.burnMax}</span>
                </li>
                <li>
                  Fuel / ly, jump cost
                  <span class="stat-yellow">{shipView?.fuelCost}</span>
                </li>
                <li>
                  Sensor profile
                  <span class="stat-yellow">{shipView?.sensorProfile}</span>
                </li>
                <li>
                  Sensor strength
                  <span class="stat-yellow">{shipView?.sensorStrength}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- combat -->
          <div style="width: 33%;">
            <div class="combat-header header">Combat performance</div>
            <div class="combat-content">
              <ul>
                <li>
                  Hull integrity
                  <span>{shipView?.hullIntegrity}</span>
                </li>
                <li>
                  Armor rating
                  <span>{shipView?.armorRating}</span>
                </li>
                <li>
                  Defense
                  <span>{shipView?.defenseType}</span>
                </li>
                <li>
                  <span data-no-color>{shipView?.defenseProperty1Name}</span>
                  <span>{shipView?.defenseProperty1Val}</span>
                </li>
                <li>
                  <span data-no-color>{shipView?.defenseProperty2Name}</span>
                  <span>{shipView?.defenseProperty2Val}</span>
                </li>
                <li>
                  <span data-no-color>{shipView?.defenseProperty3Name}</span>
                  <span>{shipView?.defenseProperty3Val}</span>
                </li>
                <li>
                  Flux capacity
                  <span>{shipView?.fluxCap}</span>
                </li>
                <li>
                  Flux dissipation
                  <span>{shipView?.fluxDiss}</span>
                </li>
                <li>
                  Top speed
                  <span>{shipView?.speedMax}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <br />

        <div class="ship-ordnance">
          <table>
            <tbody>
              <tr>
                <td>System:</td>
                <td>
                  <span class="stat-yellow">{shipView?.systemTitle}</span>
                  <br />
                  <div>{shipView?.systemDescription}</div>
                </td>
              </tr>
              <tr>
                <td>Mounts:</td>
                <td>
                  <ul>
                    {#if shipView?.mounts && shipView.mounts.length > 0}
                      {#each shipView.mounts as mount}
                        <li>
                          <span>{mount.count}x</span>
                          {capitalize(mount.size) +
                            " " +
                            capitalize(mount.type)}
                        </li>
                      {/each}
                    {:else}
                      <li>None</li>
                    {/if}
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Armaments:</td>
                <td>
                  <ul>
                    {#if shipView?.armaments && shipView.armaments.length > 0}
                      {#each shipView.armaments as armament}
                        <li>
                          <span>{armament.count}x</span>
                          {capitalize(armament.armamentName)}
                        </li>
                      {/each}
                    {:else}
                      <li>None</li>
                    {/if}
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Hullmods:</td>
                <td>
                  <ul>
                    {#each shipView?.hullmods as hullmod}
                      <li>{hullmod.name}</li>
                    {/each}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="image-container align-items-center justify-content-center">
        <div
          class="text-center justify-content-center d-flex"
          style="height: {statsHeight}px;"
        >
          <img
            src={shipView?.image}
            alt={shipView?.image}
            style="max-height: {statsHeight}px;"
          />
        </div>

        <button
          class="share codex-border p-0"
          onclick={copyLink}
          aria-label="Share link"
        >
          {#if copied}
            <img src="Images/Icons/check.png" alt="" width="16" height="16" />
          {:else}
            <img src="Images/Icons/share.png" alt="" width="16" height="16" />
          {/if}
        </button>
      </div>
    </div>

    <div class="lower-content d-flex">
      <div class="ship-lore">
        <div
          class="ship-class mb-2"
          data-class-name={shipView?.designType}
          style="--data-class-color: {shipView?.designColor};"
        >
          Design Type:&nbsp;
        </div>

        <p>
          {#each shipView?.description as line, i}
            {#if i > 0}
              <br />
            {/if}
            {line}
          {/each}
        </p>
        <br />
        <p class="mb-0 ship-price" data-price={shipView?.price}>
          Base value: &nbsp;
        </p>
      </div>

      <!-- <div class="related-entries header-before">
      </div> -->
    </div>
  </div>
</WrapperView>

<style>
  .ship-stats {
    width: 70%;
    /* font-weight: lighter; */
  }

  :is(.logistical-header, .combat-header) {
    margin-bottom: 8px;
  }

  .logistical-content {
    justify-content: space-between;
  }

  :is(.combat-content, .logistical-content) ul {
    /* margin-top: 2px; */
    text-align: start;
    width: 49%;
  }

  :is(.combat-content, .logistical-content) ul span:not([data-no-color]) {
    float: right;
    color: #e0ffef;
    text-shadow: none;
  }

  .combat-content ul {
    width: 100%;
  }

  .ship-ordnance table tr td {
    text-shadow: none;
    vertical-align: top;
  }

  .ship-ordnance table tr td ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ship-ordnance table tr td:first-child {
    width: 85px;
  }

  .image-container {
    position: relative;
    width: 30%;
  }

  .image-container .share {
    position: absolute;
    top: 0;
    left: 0;
  }

  .image-container img {
    margin: auto;
    /* lil smaller so it doesnt touch everywhere like a freak */
    max-width: 98%;
    max-height: 98%;
  }

  .lower-content {
    width: 100%;
    justify-content: space-around;
  }

  .ship-lore {
    color: white;
    text-shadow: none;
    width: 95%;
    border: 1px solid #15414d;
    padding: 8px;
    box-sizing: border-box;
    font-size: 12px;
  }

  .ship-lore p {
    margin-bottom: 0px;
  }

  .ship-class::after {
    content: attr(data-class-name);
    color: var(--data-class-color);
    text-shadow: var(--brighten-dark-text) !important;
  }

  .ship-class,
  .ship-price {
    color: #767676;
    text-shadow: var(--brighten-dark-text) !important;
  }

  /* .related-entries {
    width: 27%;
  }

  .related-entries::before {
    content: "Related entries";
    height: 16px;
    display: block;
    padding-top: 1px;
    width: 100%;
    margin-top: -16px;
  } */

  .ship-price::after {
    content: attr(data-price);
    color: #ffdd00;
    text-shadow: none !important;
  }
</style>
