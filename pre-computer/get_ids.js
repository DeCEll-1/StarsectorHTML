const candidates = [];

for (const ship of gameSources.ships) {
    if (ship.hullSize === "FIGHTER") continue;
    const csv = gameSources.ship_data.find(s => s.id === ship.hullId);
    if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;

    candidates.push({ type: 'ship', ship, csv });
}
for (const skin of gameSources.skins) {
    if (skin.restoreToBaseHull) continue;
    const base = gameSources.ships.find(s => s.hullId === skin.baseHullId);
    if (!base || base.hullSize === "FIGHTER") continue;
    const csv = gameSources.ship_data.find(s => s.id === skin.baseHullId);
    if (!csv || csv.hints.includes("HIDE_IN_CODEX")) continue;

    candidates.push({ type: 'skin', skin, base, csv });
}
console.log(
    candidates.map(
        s => firstNonEmpty(s.skin?.skinHullId, s.csv.id)
    )
        .reduce(
            (acc, val) => {
                acc += (`${val}, `);
                return acc;
            }, "")
)