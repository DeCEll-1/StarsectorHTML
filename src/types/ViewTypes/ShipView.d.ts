export { };

declare global {
  export interface ShipViewMount {
    count                                   : number;
    size                                    : string;
    type                                    : string;
  };

  export interface ShipView {
    csv                                     : ShipCSV;
    ship                                    : ShipJSON;
    skin?                                   : Skin;
    right_click_system?                     : System;
    crDeployment                            : string;
    recoveryRate                            : string;
    recoveryCost                            : string;
    deploymentPoints                        : string;
    peakPerformanceTime                     : string;
    hullSize                                : string;
    ordnancePoints                          : string;
    suppliesMonth                           : string;
    cargoCap                                : string;
    crewMax                                 : string;
    crewMin                                 : string;
    fuelCap                                 : string;
    burnMax                                 : string;
    fuelCost                                : string;
    sensorProfile                           : number;
    sensorStrength                          : number;
    hullIntegrity                           : string;
    armorRating                             : string;
    defenseType                             : string;
    defenseProperty1Name                    : string;
    defenseProperty1Val                     : string;
    defenseProperty2Name                    : string;
    defenseProperty2Val                     : string;
    defenseProperty3Name                    : string;
    defenseProperty3Val                     : string;
    fluxCap                                 : string;
    fluxDiss                                : string;
    speedMax                                : string;
    systemTitle                             : string;
    systemDescription                       : string;
    mounts                                  : ShipViewMount[];
    armaments                               : { count: number; armamentName: string; }[];
    hullmods                                : Hullmod[];
    image                                   : string;
    designType                              : string;
    designColor                             : string;
    description                             : string[];
    price                                   : string;
  }
}