import { Card } from "./Card";

export class FortFelixDeck {
    cards: Card[] = [];
  
    constructor() {
      this.buildDeck(); 
      this.shuffleDeck();
    }
  
    getTopCard(): Card{
        return this.cards.pop()!;
    }

    private buildDeck(): void {
      this.cards = [
        new Card("Richard the Lionheart", 8, 6),
        new Card("King Arthur", 8, 6),
        new Card("Saint George", 8, 6),
        new Card("King Brian Boru", 8, 6),
        new Card("Siege Tower", 4, 0),
        new Card("Siege Tower", 4, 0),
        new Card("Siege Tower", 4, 0),
        new Card("Wall-Mounted Ballista", 0, 6),
        new Card("Wall-Mounted Ballista", 0, 6),
        new Card("Watch Tower", 0, 4),
        new Card("Watch Tower", 0, 4),
        new Card("Archer Tower", 0, 5),
        new Card("Archer Tower", 0, 5),
        new Card("Archer Tower", 0, 5),
        new Card("Catapult", 6, 0),
        new Card("Catapult", 6, 0),
        new Card("Viking Warrior", 4, 4),
        new Card("Druid Runecaster", 3, 5),
        new Card("Druidess", 3, 5),
        new Card("Black Cath Sith", 5, 5),
        new Card("Robin Hood", 5, 3),
        new Card("Peasant", 3, 3),
        new Card("Peasant", 3, 3),
        new Card("Peasant", 3, 3),
        new Card("Peasant", 3, 3),
        new Card("Peasant", 3, 3),
        new Card("Longbowman", 4, 1),
        new Card("Longbowman", 4, 1),
        new Card("Tarroo-Ushtey (Water Bull)", 7, 4),
        new Card("Mercenary", 4, 4),
        new Card("Siege Engineer", 2, 1),
        new Card("Saint Oswald", 5, 4),
        new Card("Trap Builder", 2, 3),
        new Card("Trap Builder", 2, 3),
        new Card("The Boobrie", 4, 4),
        new Card("Stonemason", 2, 2),
        new Card("Black Shuck of Norfolk", 5, 5),
        new Card("Frair Tuck", 4, 3),
        new Card("The Green Knight", 5, 5),
        new Card("Merlin the Druid", 6, 6),
        new Card("Beowulf", 6, 5),
        new Card("Linton Wyrm", 6, 7),
        new Card("Dragley Beck Dragon", 7, 6),
        new Card("Red Dragon of Wales", 7, 7),
        new Card("Giant Gogmagog", 7, 7),
        new Card("Sir Tarquin the Giant", 7, 5),
        new Card("The Blind Giant of Lochlann", 0, 9),
        new Card("Scout Ranger", 4, 2),
        new Card("Pendle Witch", 4, 4),
        new Card("Siege Engineer", 2, 1),
        new Card("Siege Engineer", 2, 1),
        new Card("Saint Cuthbert", 2, 2)
      ];
    }

    private shuffleDeck() {
        return this.cards.sort(() => Math.random() - 0.5);
    }
  }
  