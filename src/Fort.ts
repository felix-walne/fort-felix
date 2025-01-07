export class Fort {
    hitPoints: number;

    constructor() {
        this.hitPoints = 30;
    }

    getDefenseDie(): number {
        if (this.hitPoints <= 9) {
            return 12;
        } else if (this.hitPoints <= 19) {
            return 10;
        } else {
            return 8;
        }
    }
}