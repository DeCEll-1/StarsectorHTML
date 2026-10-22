<!--
  this component handles:
  selectedMod
-->

<script lang="ts">
    import { resolve_mod_icon, resolve_mod_image_path } from "../lib/Utils";
    import "../css/element-list.css"


  let { mods, selectedMod = $bindable(null) }: { mods: ModInfo[]; selectedMod?: ModInfo | null } = $props();

  function changeMods(mod: ModInfo) {
    selectedMod = mod;
  }
</script>
<!-- TODO: implement accessability thingamajigs like go to bottom go to top here -->
<div class="offset codex-border codex-border-open-right element-list d-flex">
  <div class="header rounded-start-1">Indexed Mods</div>
  <ul>
    {#each mods as mod}
      <li>
        <button
          type="button"
          class="rounded-start-1"
          class:element-highlight={selectedMod?.id === mod.id}
          onclick={() => changeMods(mod)}
        >
          <div>
            <img
              alt={resolve_mod_icon(mod.icon, mod)}
              src={resolve_mod_icon(mod.icon, mod)}
            />
          </div>
          <div>
            <div>{mod.name}</div>
            <div>{mod.author}</div>
          </div>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .offset {
    transform: translateX(8px);
    z-index: 100;
  }
</style>
