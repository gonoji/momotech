import { StationCard } from "./stationCard";
import { StationEstate } from "./stationEstate";
import { StationMinus } from "./stationMinus";
import { StationPlus } from "./stationPlus";

export const stations = {
    'plus': StationPlus,
    'minus': StationMinus,
    'card': StationCard,
    'estate' :StationEstate
} as const;
