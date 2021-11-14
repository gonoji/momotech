import { StationCard } from "./stationCard";
import { StationMinus } from "./stationMinus";
import { StationPlus } from "./stationPlus";

export const stations = {
    'plus': StationPlus,
    'minus': StationMinus,
    'card': StationCard
} as const;
