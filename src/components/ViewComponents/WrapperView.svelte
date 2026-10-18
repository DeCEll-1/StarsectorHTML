<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    headerText,
    children,
  }: { headerText: string | undefined; children?: Snippet } = $props();
</script>

<div class="codex-border codex-border-open-left overflow-scroll" style="max-height: 100vh;">
  <div class="header zaza-spacing">{headerText ?? "undefined"}</div>
  <div class="zaza-spacing">
    {@render children?.()}
  </div>
</div>

<style>
  .zaza-spacing {
    width: calc(100% - 4px);
    margin-left: 4px;
  }
</style>
