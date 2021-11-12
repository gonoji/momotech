
export class GameDate{
    private readonly date: { year: number, month: number, week: number };
    static months: number = 12;
 
    constructor(){
        this.date = { year: 0, month: 0, week: 0 };
    }
    advance(numPlayers: number){
        this.date.week++;
        if(this.date.week == numPlayers){
            this.date.week = 0;
            this.date.month++;
            if(this.date.month == GameDate.months){
                this.date.month = 0;
                this.date.year++;
            }
        }
    }
    /**
     * @returns 1, 2, ...
     */
    get year(){
        return this.date.year + 1;
    }
    /**
     * @returns 4, 5, ..., 12, 1, 2, 3
     */
    get month(){
        return (this.date.month + 3) % 12 + 1;
    }
    /**
     * @returns 0, 1, ..., プレイヤー数 - 1
     */
    get week(){
        return this.date.week;
    }
}
