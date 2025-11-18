const SHIP_HTML =
    `
<div id="ship_name_header" class="ship-header mb-4"></div>

<div class="item-view-content scroll-bar scroll-bar-container" data-simplebar>

    <div class="d-flex mb-4 justify-space-around ">

        <div class="ship-stats">
            <div class="d-flex stats-header center mb-4">

                <div class="d-block" style="width: 65%;">
                    <div class="logistical-header">
                        Logistical data
                    </div>


                    <div class="logistical-content d-flex">
                        <ul>
                            <li>CR per deployment
                                <span id="cr_deployment"> </span>
                            </li>

                            <li>&nbsp;Recovery (/ day)
                                <span id="recovery_rate"></span>
                            </li>
                            <li>&nbsp;Recovery (supplies)
                                <span id="recovery_cost"></span>
                            </li>
                            <li>&nbsp;Deployment points
                                <span class="stat-dp" id="deployment_points"></span>
                            </li>
                            <li>Peak performance (sec)
                                <span class="stat-white" id="peak_performance_time"></span>
                            </li>
                            <li>Crew complement
                                <span class="stat-crew" id="crew_complement"></span>
                            </li>

                            <li> &nbsp; </li>
                            <li>Hull size
                                <span class="stat-yellow" id="hull_size"></span>
                            </li>
                            <li>Ordnance points
                                <span class="stat-yellow" id="ordnance_points"></span>
                            </li>
                        </ul>
                        <ul>
                            <li>Maintenance (sup/mo)
                                <span id="supplies_month"></span>
                            </li>
                            <li>Cargo capacity
                                <span class="stat-cargo" id="cargo_cap"></span>
                            </li>
                            <li>Maximum crew
                                <span class="stat-crew" id="crew_cap"></span>
                            </li>
                            <li>Skeleton crew required
                                <span class="stat-crew" id="crew_min"></span>
                            </li>
                            <li>Fuel capacity
                                <span class="stat-fuel" id="fuel_cap"></span>
                            </li>
                            <li>Maximum burn
                                <span class="stat-yellow" id="burn_max"></span>
                            </li>
                            <li>Fuel / ly, jump cost
                                <span class="stat-yellow" id="fuel_cost"></span>
                            </li>
                            <li>Sensor profile
                                <span class="stat-yellow" id="sensor_profile"></span>
                            </li>
                            <li>Sensor strength
                                <span class="stat-yellow" id="sensor_strength"></span>
                            </li>
                        </ul>
                    </div>
                </div>


                <div style="width: 33%;">
                    <div class="combat-header">
                        Combat performance
                    </div>
                    <div class="combat-content">
                        <ul>
                            <li>Hull integrity
                                <span id="hull_integrity"></span>
                            </li>
                            <li>Armor rating
                                <span id="armor_rating"></span>
                            </li>
                            <li>Defense
                                <span id="defense_type"></span>
                            </li>
                            <li>
                                <span id="defense_property_1_name" no-color>Shield arc</span>
                                <span id="defense_property_1_val"></span>
                            </li>
                            <li><span id="defense_property_2_name" no-color>Shield upkeep/sec</span>
                                <span id="defense_property_2_val"></span>
                            </li>
                            <li> <span id="defense_property_3_name" no-color>Shield
                                    flux/damage</span>
                                <span id="defense_property_3_val"></span>
                            </li>
                            <li>Flux capacity
                                <span id="flux_cap"></span>
                            </li>
                            <li>Flux dissipation
                                <span id="flux_diss"></span>
                            </li>
                            <li>Top speed
                                <span id="speed_max"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <br>

            <div class="ship-ordnance">
                <table>
                    <tr>
                        <td class="ship-ordnance-title">System:</td>
                        <td>
                            <span class="stat-yellow" id="system_title"></span>
                            <br>
                            <div id="system_description">

                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td class="ship-ordnance-title">Mounts:</td>
                        <td>
                            <ul id="mounts_list">

                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td class="ship-ordnance-title">Armaments:</td>
                        <td>
                            <ul id="armaments_list">

                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td class="ship-ordnance-title">Hullmods:</td>
                        <td>
                            <ul id="hullmods_list">

                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="ship-image center center-grid-img">
            <img id="image" src="">
            <span class="share codex-border" onclick="
                navigator.clipboard.writeText(\`https:\/\/decell-1.github.io/StarsectorHTMLEmbeds/AutoGen/Embeds/\${current_ship.selectedHull}\`);
                showToaster(
'Copied to clipboard!',
'Ship link has been copied to the clipboard.',
{img: current_ship.image}
                );
            ">v</span>
        </div>
    </div>

    <div class="lower-content d-flex">
        <div class="ship-lore">
            <div id="design_type" class="ship-class mb-4" data-class-name="None" style="--data-class-color: #FFFFFF">
                Design Type: </div>

            <p id="description">

            </p>

            <p id="price" class="ship-price" data-price="">
                Base value:
            </p>
        </div>

        <div id="related_entries" class="related-entries">

        </div>

    </div>
</div>
`
const WEAPON_HTML =
    //#region explanation
    /*
    damage can be set to show up as soft with a certaint ag
    
    customPrimaryHL
    specifies what to color in yellow in customPrimary, seperated using " | "s
    
    customAncillaryHL
    specifies what to color in yellow in customAncillary, seperated using " | "s
    
    for both of these you can use both %s (will replace %s with the order in *HL)
    and
    the name of the thing to replace
    so if theres SYNERGY in *HL you can just write SYNERGY in * and itll paint it yellow
    
    
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    "primaryRoleStr"       : Primary role                   : *shouldnt* be ""                                                                 : 
    $mountType             : figure out from weapon         :                                                                                  : 
    OPs                    : ordnance points                :                                                                                  : 
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    range                  : Range                          :                                                                                  : 
    "damage/shot"          : Damage                         : not displayed if ""_  also + "x" + weapon_data["burst size"]                     : 
    "damage/second"        : Damage / second                : noDPSInTooltip makes it not display this if its anything else than ""            : 
    emp                    : EMP damage                     :                                                                                  : 
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    "energy/second"        : Flux / second                  : not displayed if ""                                                              : 
    "energy/shot"          : Flux / shot                    : not displayed if ""                                                              : 
    HHHHHHHHHHHHHHHHHHHHHH : Flux / non-EMP damage          : calculate this somehow                                                           : 
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    customPrimary          : lower text of the upper part   : calculate with customPrimaryHL                                                   : 
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    type                   : Damage type                    : HIGH_EXPLOSIVE_KINETIC_ENERGY_FRAGMENTATION_OTHER other displays "Other (beam)"  : 
    trackingStr            : Tracking                       : "Perfect" if ""                                                                  : 
    turnRateStr            : Turn rate                      : "Can't turn" if ""                                                               : 
    speedStr               : Speed                          : not displayed if ""                                                              : 
    accuracyStr            : Accuracy                       :                                                                                  : 
    hitpoints              : Hitpoints                      :                                                                                  : 
    "ammo/sec"             : Seconds / reload               : calculate this to display seconds per reload instead of ammo per second          : 
    ammo                   : Max ammo                       :                                                                                  : 
    "reload size"          : Reload size                    : not displayed if ""                                                              : 
    HHHHHHHHHHHHHHHHHHHHHH : Refine delay (seconds)         : min(chargeup + (burst size * burst delay) + chargedown, 0.05)                    : 
    customAncillary        : lower text of the lower part   : calculated with customAncillaryHL                                                : 
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    "turn rate"            : these arent displayed on codex :                                                                                  : 
    "spread/shot"          : these arent displayed on codex :                                                                                  : 
    "spread decay/sec"     : these arent displayed on codex :                                                                                  : 
    "min spread"           : these arent displayed on codex :                                                                                  : 
    "max spread"           : these arent displayed on codex :                                                                                  : 
    "for weapon tooltip>>" : these arent displayed on codex : doesnt seem to have an use                                                       : 
    chargeup               : these arent displayed on codex : how long it takes a weapon to start firing after the command to fire is given    : 
    chargedown             : these arent displayed on codex : how long it takes a weapon to cool down after firing a burst                     : 
    "burst size"           : these arent displayed on codex :                                                                                  : 
    "burst delay"          : these arent displayed on codex : delay between shots in burst                                                     : 
    ---------------------- : ------------------------------ : -------------------------------------------------------------------------------- : 
    */
    //#endregion
    `
                <div id="ship_name_header" class="ship-header mb-4"></div>

                <div class="d-flex justify-space-between" style="">
                    <div class="ship-lore" style="width: 59%; height: min-content;">

                        <div id="design_type" class="ship-class mb-4" data-class-name="None"
                            style="--data-class-color: #FFFFFF; font-size: 10px;">
                            Design Type: </div>

                        <p id="description">

                        </p>

                        <p id="price" class="ship-price" data-price="">
                            Base value:
                        </p>
                    </div>

                    <div id="stats_container" style="width:39%" class="me-4">
                        <div class="header">
                            Primary data
                        </div>
                        <div>

                            <div class="d-flex justify-space-between">
                                <div class="view-weapon-img-container center">
                                    <div class="svg-weapon-overlay" style="margin: auto">
                                        <img id="image" class="d-flex">
                                    </div>
                                    <div class="center mt-4">
                                        <span class="share codex-border" onclick="
                                navigator.clipboard.writeText(\`https:\/\/decell-1.github.io/StarsectorHTMLEmbeds/AutoGen/Embeds/\${current_id}\`);
                                    showToaster(
                                        'Copied to clipboard!',
                                        'Ship link has been copied to the clipboard.',
                                        {img: EL.image.src}
                                    );
                                ">v</span>
                                    </div>
                                </div>

                                <div style="width: 75%;" class="pt-4">

                                    <div class="weapon-stats">
                                        <ul>
                                            <li>Primary Role<span id="primary_role">test</span></li>
                                            <li>Mount type<span id="mount_type">test</span></li>
                                            <li>&nbsp;<span id="stat_modifier_specification">Count as x for stat
                                                    modifiers</span></li>
                                            <li>Ordnance points<span id="op_cost">0</span></li>
                                            <li>&nbsp;</li>
                                            <li>Range<span id="range">0</span></li>
                                            <li>Damage<span id="damage">0</span></li>
                                            <li>Damage / second<span id="damage_second">0</span></li>
                                            <li>EMP damage<span id="emp_damage">0</span></li>
                                            <li>&nbsp;</li>
                                            <li>Flux / second<span id="flux_second">0</span></li>
                                            <li>Flux / shot<span id="flux_shot">0</span></li>
                                            <li>Flux / non-EMP damage<span id="flux_non_emp_damage">0</span></li>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                            <span class="stat-yellow me-3" style="float:right" id="no_recharge_ammo_display">0</span>
                            <br/>

                            <div class="d-block mt-4" id="customPrimary">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus nesciunt, odio
                                repellat ipsam illum maiores dignissimos quasi harum, omnis, ratione saepe fuga
                                temporibus fugit. Neque alias maxime reiciendis adipisci amet!
                            </div>
                            <div class="header mt-2">
                                Ancillary stats
                            </div>
                            <div class="d-flex justify-space-between">
                                <div class="view-weapon-img-container center">
                                    <img id="type_image" src="./Resources/Images/Icons/damagetype_other.png"
                                        style="width: 80px; height: 80px; max-width: 72px; max-height: 72px; margin: auto;" alt="">
                                </div>
                                <div style="width: 75%;" class="pt-4 ms-4">
                                    <div class="weapon-stats">
                                        <ul>
                                            <li>Damage Type<span id="damage_type">test</span></li>
                                            <li>&nbsp;</li>
                                            <li>Speed<span id="speed">test</span></li>
                                            <li>Tracking<span id="tracking">test</span></li>
                                            <li>hitpoints<span id="hitpoints">test</span></li>
                                            <li>Accuracy<span id="accuracy">0</span></li>
                                            <li>Turn rate<span id="turn">test</span></li>
                                            <li>&nbsp;</li>
                                            <li>
                                                <span id="max_ammo_name" no-color>Max ammo</span>
                                                <span id="max_ammo">0</span></li>
                                            <li>
                                                <span id="seconds_reload_name" no-color>Seconds / reload</span>
                                                <span id="seconds_reload">0</span></li>
                                            <li>
                                                <span id="reload_size_name" no-color>Reload size</span>
                                                <span id="reload_size">0</span></li>
                                            <li>&nbsp;</li>
                                            <li>Burst size<span id="burst_size">0</span></li>
                                            <li>Refire delay (seconds)<span id="refire_delay">0</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="d-block mt-4" id="customAncillary">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus nesciunt, odio
                                repellat ipsam illum maiores dignissimos quasi harum, omnis, ratione saepe fuga
                                temporibus fugit. Neque alias maxime reiciendis adipisci amet!
                            </div>

                        </div>
                    </div>
                </div>
`
