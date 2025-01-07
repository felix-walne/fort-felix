import { Card } from "./Card";
import { Fort } from "./Fort";
import { FortFelixDeck } from "./FortFelixDeck";

export class Player {
    name: string;
    hand: Card[] = [];
    attackRow: Card[] = [];
    defenseRow: Card[] = [];
    fort: Fort;

    constructor(name: string) {
        this.fort = new Fort();
        this.name = name;
    }

    drawCards(deck: FortFelixDeck): void {
        const cardsToDraw = this.hand.length <= 4 ? 2 : this.hand.length === 5 ? 1 : 0;
        for (let i = 0; i < cardsToDraw && deck.cards.length > 0; i++) {
            const card = deck.getTopCard();
            this.hand.push(card);
            console.log(`${this.name} drew ${card.name} (Attack: ${card.attack}, Defense: ${card.defense}).`);
        }
    }
}