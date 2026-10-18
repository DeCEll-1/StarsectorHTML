<!-- this Main file will ONLY host & handle:
    the grid
-->

<script lang="ts">
  //#region imports
  import ElementList from "./components/ElementList.svelte";
  import ModList from "./components/ModList.svelte";
  import ShipView from "./components/ViewComponents/ShipView.svelte";
  import EmptyView from "./components/ViewComponents/EmptyView.svelte";
  import Enumerable from "linq";
  import { gameData } from "./lib/GameData";
  import { ViewStateFactory, ViewType, type ViewState } from "./lib/Viewtypes";
  import { navState } from "./lib/Navigation.svelte";

  if (typeof window !== "undefined") {
    (window as any).gameData = gameData;
    (window as any).navState = navState;
  }
  //#endregion
</script>

<div class="grid-container font-victor-mono">
  <div></div>
  <ModList
    mods={Enumerable.from(gameData.mods)
      .orderBy((s) => s.name)
      .toArray()}
    bind:selectedMod={navState.selectedMod}
  />
  <ElementList selectedMod={navState.selectedMod} bind:selectedView={navState.selectedView} />
  {#if navState.selectedView.type == ViewType.None}
    <EmptyView></EmptyView>
  {:else if navState.selectedView.type === ViewType.Ship}
    <ShipView {...navState.selectedView} />
  {/if}
  <div></div>
</div>

<style>
  .grid-container {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns:
      1fr
      var(--mod-list-width) var(--search-results-width) var(--main-view-width)
      1fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-template-areas: ". . . . .";

    height: 100%;
    min-height: 100vh;
  }
</style>
