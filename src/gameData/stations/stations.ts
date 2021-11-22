import { stationBaseData } from "./station";
import { StationCard } from "./stationCard";
import { StationEstate, stationEstateData } from "./stationEstate";
import { StationMinus } from "./stationMinus";
import { StationPlus } from "./stationPlus";
import { StationShop, stationShopData } from "./stationShop";

export const stations = {
    'plus': StationPlus,
    'minus': StationMinus,
    'card': StationCard,
    'estate' :StationEstate,
    'shop' : StationShop
} as const;

export type stationData = stationBaseData | stationEstateData | stationShopData;
