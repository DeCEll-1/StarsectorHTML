<!--
  this component handles:
  selectedView
-->

<script lang="ts">
  import Enumerable from "linq";
  import { CODEX_ICON_SHIPS, ICON_CODEX_ARROW_UP } from "../lib/Constants";
  import {
    firstNonEmpty,
    getSearchBarPlaceholder,
    resolve_mod_image_path,
  } from "../lib/Utils";
  import { ViewStateFactory, ViewType, type ViewState } from "../lib/Viewtypes";
  import "../css/element-list.css";
  import {
    getShipCandidates,
    type ShipCandidate,
  } from "../lib/Views/ShipViewUtils";
  import "overlayscrollbars/overlayscrollbars.css";
  import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
  import { navState } from "../lib/Navigation.svelte";

  let {
    selectedMod,
    selectedView = $bindable(ViewStateFactory.none),
  }: {
    selectedMod: ModInfo;
    selectedView: ViewState;
  } = $props();

  let selectedItemId: string = $derived.by(() => {
    const viewType = selectedView.type;
    switch (viewType) {
      case ViewType.None:
        return "";
      case ViewType.Ship:
        return selectedView.skin
          ? selectedView.skin.skinHullId
          : selectedView.ship!.hullId;
      default:
        return "";
    }
  });

  //#region selections

  const selectShip = (csv: ShipCSV, ship?: ShipJSON, skin?: Skin) => {
    selectedView = ViewStateFactory.ship(csv, ship, skin);
  };

  //#endregion

  //#region elements

  type ListElement = {
    iconClass: string | undefined;
    icon: string;
    name: string;
    id: string;
    data: any;
    subtitle: string | undefined;
    onClick: (() => void) | undefined;
  };
  let elements: ListElement[] = $derived.by(() => {
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
            id: "Ships",
            data: undefined,
            onClick: () => {
              const candidates = getShipCandidates(filter, modId, true);
              if (candidates?.length) {
                selectShip(
                  candidates[0].csv,
                  candidates[0].ship,
                  candidates[0].skin,
                );
              } else {
                selectedView = ViewStateFactory.shipn;
              }
            },
          },
        ];

      case ViewType.Ship:
        return getShipCandidates(filter, modId).map((s) => {
          const id = s.type === "ship" ? s.ship.hullId : s.skin.skinHullId;
          const hullName =
            s.type === "ship" ? s.ship.hullName : s.skin.hullName;
          const spritePath =
            (s.type === "ship" ? s.ship.spriteName : s.skin.spriteName) ||
            s.ship.spriteName;

          if (!spritePath) {
            throw new Error(
              "Could not find sprite for ship: " + JSON.stringify(s),
            );
          }

          return {
            iconClass: undefined,
            icon: spritePath,
            name: hullName,
            id: `${id}`,
            data: s,
            subtitle: s.csv.designation,
            onClick: () => selectShip(s.csv, s.ship, s.skin),
          };
        });

      default:
        return [];
    }
  });

  //#endregion
  let searchInput: HTMLInputElement | undefined = $state();
  let goUpButton: HTMLButtonElement | undefined = $state();
  let list: HTMLUListElement | undefined = $state();
  // let overlayScrollbarsComponent: OverlayScrollbarsComponent | undefined =
  //   $state();
  // let listContainer: HTMLDivElement | undefined = $state();
  let filter: string = $state("");
  let cycleIndex: number = $state(0);
  let previousKey: string = $state("");

  function handleKeydown(
    event: KeyboardEvent & { currentTarget: EventTarget & Window },
  ) {
    if (!searchInput || elements.length == 0) return;

    if (document.activeElement === searchInput) return;

    const key = event.key.toLocaleLowerCase();

    if (key.length != 1) return;

    const didPressSearchShortcut = key === "/" || key === "\"" || key === "'";
    if (didPressSearchShortcut) {
      searchInput.focus();
      event.preventDefault();
      return;
    }

    if (true) {
      // if (listContainer?.contains(document.activeElement)) {

      if (previousKey != key) {
        previousKey = key;
        cycleIndex = 0;
      }

      let matchCount = 0;

      const isNthMatch = (s: ListElement) => {
        const startsWith = s.name.toLocaleLowerCase().startsWith(key);
        if (!startsWith) return false;
        if (matchCount == cycleIndex) {
          return true;
        } else {
          matchCount++;
        }
        return false;
      };

      let matchedIndex = elements.findIndex(isNthMatch);

      if (matchedIndex == -1) {
        cycleIndex = 0;
        matchCount = 0;
        matchedIndex = elements.findIndex(isNthMatch);
      }

      navState.selectShipById(elements[matchedIndex].id, selectedMod.id);
      const elementButtons = list?.querySelectorAll("li button");
      // we +1 here because ... exists
      const targetButton = elementButtons?.[
        matchedIndex + 1
      ] as HTMLButtonElement;
      targetButton?.scrollIntoView({ behavior: "smooth" });
      targetButton?.focus();
      cycleIndex++;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="element-list d-flex codex-border codex-border-open-right vh-100"
  // bind:this={listContainer}
>
  <div class="header">
    {selectedView.type == ViewType.None ? "Select View" : selectedView.type}
  </div>

  <div class="position-relative">
    <div class="position-absolute w-100">
      <button
        type="button"
        class="skip-to-search-btn"
        onclick={() => searchInput?.focus()}
      >
        Skip to search
      </button>
    </div>
  </div>

  <OverlayScrollbarsComponent
    options={{
      scrollbars: {
        theme: "starsector-scrollbar-theme",
        dragScroll: true,
        clickScroll: true,
        pointers: ["mouse", "touch", "pen"],
        autoHide: "never",
      },
    }}
    // bind:this={overlayScrollbarsComponent}
  >
    <ul tabindex="-1" bind:this={list}>
      {#if selectedView.type != ViewType.None}
        <li>
          <button
            type="button"
            bind:this={goUpButton}
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
        </li>
      {/if}
      {#each elements as item (`${item.id}`)}
        <li>
          <button
            type="button"
            class:element-highlight={item.id === selectedItemId}
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
  </OverlayScrollbarsComponent>
  {#if selectedView.type != ViewType.None}
    <div class="input-container">
      <input
        bind:this={searchInput}
        id="search_bar_text_box"
        type="text"
        placeholder={getSearchBarPlaceholder(selectedView)}
        bind:value={filter}
        onkeydown={(e) => {
          if (e.key === "Escape") {
            e.currentTarget.blur();
          }
        }}
      />
    </div>

    <div class="position-relative">
      <div class="position-absolute w-100">
        <button
          type="button"
          class="skip-to-top-btn w-100"
          onclick={() => goUpButton?.focus()}
        >
          Go to top
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .element-list {
    z-index: 200;
  }

  /* #region input */

  .input-container {
    margin-top: auto;
  }

  input[type="text"] {
    background-color: #0d272f;
    border: 1px solid #11303a;
    color: #a8dbfc;
    transition: all 0.5s ease;
    width: 100%;
  }

  input[type="text"]:focus {
    background-color: #10313b;
    border: 1px solid #1f5e70;
    outline: 0;
  }

  input[type="text"]::placeholder {
    transition: all 0.5s ease;
    color: #737373;
  }

  input[type="text"]:focus::placeholder {
    color: #a3a3a3;
  }

  /* #endregion */

  /* #region accessability */

  .skip-to-top-btn,
  .skip-to-search-btn {
    position: fixed;
    top: -9999px;
    left: -9999px;
    z-index: 999;
    color: var(--ui-text-light);
    border: none;
    font-size: larger;
  }

  .skip-to-search-btn:focus {
    position: absolute;
    background-color: black;
    margin-left: auto;
    top: 4px;
    right: 8px;
    width: min-content;
    text-wrap: nowrap;
  }

  .skip-to-top-btn:focus {
    position: inherit;
    background-color: var(--ui-blue-dark);
    top: -20px;
    left: 0px;
    width: 100%;
  }

  /* #endregion */
</style>
