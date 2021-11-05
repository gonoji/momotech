
export class Deque<T>{
    private fronts: T[];
    private backs: T[];
    constructor(){
        this.fronts = [];
        this.backs = [];
    }

    pushFront(x: T){
        this.fronts.push(x);
    }
    pushBack(x: T){
        this.backs.push(x);
    }
    popFront(){
        if(this.fronts.length == 0){
            const mid = Math.ceil(this.backs.length / 2);
            [this.fronts, this.backs] = [this.backs.slice(0, mid).reverse(), this.backs.slice(mid)];
        }
        return this.fronts.pop();
    }
    popBack(){
        if(this.backs.length == 0){
            const mid = Math.ceil(this.fronts.length / 2);
            [this.backs, this.fronts] = [this.fronts.slice(0, mid).reverse(), this.fronts.slice(mid)];
        }
        return this.backs.pop();
    }

    front(){
        return this.fronts[this.fronts.length - 1] ?? this.backs[0];
    }
    back(){
        return this.backs[this.backs.length - 1] ?? this.fronts[0];
    }
    empty(){
        return this.fronts.length + this.backs.length == 0;
    }
    print(){
        console.log([...[...this.fronts].reverse(), ...this.backs]);
    }
}
