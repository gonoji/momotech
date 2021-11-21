import { StationCard } from "./stationCard";
import { StationEstate } from "./stationEstate";
import { StationMinus } from "./stationMinus";
import { StationPlus } from "./stationPlus";
import { StationShop } from "./stationShop";

export const stations = {
    'plus': StationPlus,
    'minus': StationMinus,
    'card': StationCard,
    'estate' :StationEstate,
    'shop' : StationShop
} as const;
