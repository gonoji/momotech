import { EventMessage } from "../events/eventMessage";
import { EventRoulette } from "../events/eventRoulette";
import { Destination } from "../gameData/destination";
import { GameData } from "../gameData/gameData";
import { StationEstate } from "../gameData/stations/stationEstate";
import { Util } from "../utils/util";
import { Routine, subroutine } from "./routine";

export function* routinePickDest(data: GameData): subroutine<void>{
    const mes = new EventMessage((data.field.destination? '次': '最初') + 'の目的地は……');
    yield mes;
    const dest = yield* pickDest(data);
    yield mes;
    data.field.setDestination(dest);
    yield new EventMessage(stringify(dest) + 'の駅です！');
    yield 'end';
    yield 'end';
}

function* pickDest(data: GameData){
    const estateStations = data.field.stations.filter(
        (station): station is StationEstate => station.type == 'estate'
    );
    return yield* Routine.execute(new EventRoulette(() => Util.pick(estateStations), stringify));
}
function stringify(station: StationEstate){
    return station.estates.map(s => s.name).join(' ');
}

export function* routineArriveDest(data: GameData): subroutine<void>{
    yield new EventMessage('目的地到着！！！');
    yield 'end';
    data.turnPlayer.money += 5000_0000_0000_0000;
    yield new EventMessage('おかねあげる');
    yield 'end';
    yield* routinePickDest(data);
}
