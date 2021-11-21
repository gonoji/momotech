import { EventMessage } from "../events/eventMessage";
import { EventRoulette } from "../events/eventRoulette";
import { GameData } from "../gameData/gameData";
import { StationEstate } from "../gameData/stations/stationEstate";
import { Util } from "../utils/util";
import { Routine } from "./routine";

export class RoutinePickDest extends Routine<void>{
    *routine(data: GameData){
        const mes = new EventMessage((data.field.destination? '次': '最初') + 'の目的地は……');
        yield mes;
        const dest = yield* this.pickDest(data);
        yield mes;
        data.field.destination = dest;
        yield new EventMessage(this.stringify(dest) + 'の駅です！');
        yield 'end';
        yield 'end';
    }
    private *pickDest(data: GameData){
        const estateStations = data.field.stations.filter(
            (station): station is StationEstate => station.type == 'estate'
        );
        return yield* Routine.execute(new EventRoulette(() => Util.pick(estateStations), this.stringify));
    }
    private stringify(station: StationEstate){
        return station.estates.map(s => s.name).join(' ');
    }
}
