<!--
  this component handles:
  selectedView
-->

<script lang="ts">
  import Enumerable from "linq";
  import { CODEX_ICON_SHIPS, ICON_CODEX_ARROW_UP } from "../lib/Constants";
  import {
    firstNonEmpty,
    getShipCandidates,
    resolve_mod_image_path,
  } from "../lib/Utils";
  import { ViewStateFactory, ViewType, type ViewState } from "../lib/Viewtypes";
  import "../css/element-list.css";

  let {
    selectedMod,
    selectedView = $bindable(ViewStateFactory.none),
  }: {
    selectedMod: ModInfo;
    selectedView: ViewState;
  } = $props();

  let selectedItemName: string = $derived.by(() => {
    const viewType = selectedView.type;
    switch (viewType) {
      case ViewType.None:
        return "";
      case ViewType.Ship:
        return firstNonEmpty(selectedView.skin?.hullName, selectedView.ship?.hullName);
      default:
        return "";
    }
  });
  let elements: {
    iconClass: string | undefined;
    icon: string;
    name: string;
    subtitle: string | undefined;
    onClick: (() => void) | undefined;
  }[] = $derived.by(() => {
    const viewType = selectedView.type;
    const modId = selectedMod.id;

    switch (viewType) {
      case ViewType.None:
        return [
          {
            iconClass: undefined,
            icon: CODEX_ICON_SHIPS,
            name: "Ships",
            subtitle: undefined,
            onClick: () => {
              selectedView = ViewStateFactory.shipn;
            },
          },
        ];
      case ViewType.Ship:
        const selectShip = (csv: ShipCSV, ship?: ShipJSON, skin?: Skin) => {
          // selectedItemName = ship ? ship.hullName : skin!.hullName;
          selectedView = ViewStateFactory.ship(csv, ship, skin);
        };

        return Enumerable.from(getShipCandidates("", modId))
          .select((s) => {
            if (s.type === "ship") {
              return {
                iconClass: undefined,
                icon: s.ship.spriteName,
                name: s.ship.hullName,
                subtitle: s.csv.designation,
                onClick: () => {
                  selectShip(s.csv, s.ship, s.skin);
                },
              };
            } else {
              return {
                iconClass: undefined,
                icon: s.skin.spriteName,
                name: s.skin.hullName,
                subtitle: s.csv.designation,
                onClick: () => {
                  selectShip(s.csv, s.ship, s.skin);
                },
              };
            }
          })
          .toArray();
      default:
        return [];
    }
  });
</script>

<div class="element-list d-flex codex-border codex-border-open-right vh-100">
  <div class="header">
    {selectedView.type == ViewType.None ? "Select View" : selectedView.type}
  </div>
  <ul>
    {#if selectedView.type != ViewType.None}
      <li>
        <button
          type="button"
          class="rounded-start-1"
          onclick={() => (selectedView = ViewStateFactory.none)}
        >
          <div>
            <img src={ICON_CODEX_ARROW_UP} alt={ICON_CODEX_ARROW_UP} />
          </div>
          <div>
            <div>...</div>
            <div></div>
          </div>
        </button>
      </li>{/if}
    {#each elements as item}
      <li>
        <button
          type="button"
          class:element-highlight={item.name === selectedItemName}
          class="rounded-start-1"
          onclick={item.onClick}
        >
          <div class={item.iconClass ?? ""}>
            <img
              src={selectedView.type == ViewType.None
                ? item.icon
                : resolve_mod_image_path(item.icon, selectedMod)}
              alt={item.name}
            />
          </div>
          <div>
            <div>{item.name}</div>
            <div>{item.subtitle}</div>
          </div>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .element-list {
    z-index: 200;
  }
</style>
