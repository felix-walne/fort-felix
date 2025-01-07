import {waitForEnter, rollDie, prompt, lineReader} from "./Interactions";
import {logToConsole} from "./utils/Logger";

import { FortFelixDeck } from "./FortFelixDeck";
import { Player } from "./Player";
import { Fort } from "./Fort";
import { Graveyard } from "./Graveyard";
import { renderBoard } from "./utils/Renderer";

async function npcActionPhase(player: Player, npc: Player, playerFort: Fort, npcFort: Fort) {
    renderBoard(player, npc, playerFort, npcFort);

    await logToConsole('--- Action Phase ---');
    // NPC places cards automatically, prioritising defense row, then attack row
    while (npc.hand.length > 0 && (npc.attackRow.length < 4 || npc.defenseRow.length < 4)) {
        const card = npc.hand.pop()!;
        if (npc.defenseRow.length < 4 && card.defense > 0) {
            npc.defenseRow.push(card);
            await logToConsole(`NPC placed ${card.name} in the defense row.`);
        } else if (npc.attackRow.length < 4 && card.attack > 0) {
            npc.attackRow.push(card);
            await logToConsole(`NPC placed ${card.name} in the attack row.`);
        } else {
            await logToConsole(`NPC could not place ${card.name}.`);
            npc.hand.push(card); // Return the card to the hand if not placed
            break;
        }
    }

    // Render Board after placements
    renderBoard(player, npc, playerFort, npcFort);
}

async function npcBattlePhase(activePlayer: Player, inactivePlayer: Player, graveyard: Graveyard) {
    await logToConsole('--- Battle Phase ---');
    let attacksRemaining = 3;
    while (attacksRemaining > 0 && activePlayer.attackRow.length > 0) {
        const attacker = activePlayer.attackRow[0]; // NPC uses the first card in its attack row
        await logToConsole(`NPC attacks with ${attacker.name}! (A:${attacker.attack})`);

        // Determine target
        let target;
        if (inactivePlayer.attackRow.length > 0) {
            target = inactivePlayer.attackRow[0];
            await logToConsole(`Targeting player's card in attack row: ${target.name} (D:${target.defense}).`);
        } else if (inactivePlayer.defenseRow.length > 0) {
            target = inactivePlayer.defenseRow[0];
            await logToConsole(`Targeting player's card in defense row: ${target.name} (D:${target.defense}).`);
        } else {
            await logToConsole("Player has no cards on the battlefield. Attacking the fort!");
            const attackRoll = rollDie(6, activePlayer) + attacker.attack;
            const fortRoll = rollDie(inactivePlayer.fort.getDefenseDie(), inactivePlayer);
            const damage = Math.max(0, attackRoll - fortRoll);
            inactivePlayer.fort.hitPoints -= damage;
            await logToConsole(`NPC attacked the fort! Fort HP reduced by ${damage} to ${inactivePlayer.fort.hitPoints}.`);
            break;
        }

        // Resolve attack on a card
        if (target) {
            const attackRoll = rollDie(6, activePlayer) + attacker.attack;
            const defenseRoll = rollDie(6, activePlayer) + (inactivePlayer.attackRow.includes(target) ? target.attack : target.defense);
            await logToConsole(`NPC rolled ${attackRoll} (total attack). Player rolled ${defenseRoll} (total defense).`);

            if (attackRoll > defenseRoll) {
                await logToConsole(`${attacker.name} defeated ${target.name}!`);
                if (inactivePlayer.attackRow.includes(target)) {
                    inactivePlayer.attackRow.splice(inactivePlayer.attackRow.indexOf(target), 1);
                } else {
                    inactivePlayer.defenseRow.splice(inactivePlayer.defenseRow.indexOf(target), 1);
                }
                graveyard.cards.push(target);
            } else {
                await logToConsole(`${target.name} withstood the attack or defeated ${attacker.name}!`);
                activePlayer.attackRow.splice(activePlayer.attackRow.indexOf(attacker), 1);
                graveyard.cards.push(attacker);
                break; // End the NPC's turn
            }
        }

        attacksRemaining--;
    }
}

async function playerActionPhase(player: Player, npc: Player, playerFort: Fort, npcFort: Fort, activePlayer: Player, graveyard: Graveyard) {
    renderBoard(player, npc, playerFort, npcFort);
    await logToConsole('--- Action Phase ---');
    let actions = 2;
    while (actions > 0) {
        await logToConsole(`\nActions remaining: ${actions}`);
        await logToConsole(`Your hand:\n ${player.hand.map((c, i) => `(index:${i}) ${c.name} (A:${c.attack}, D:${c.defense})`).join('\n')}`);
        const action = await prompt('Choose an action (play, end): ');

        if (action === 'play') {
            const cardIndex = await prompt('Enter the index of the card to play: ');
            const card = player.hand[+cardIndex];
            if (card) {
                const row = await prompt('Choose a row to place the card (attack/defense): ');
                if (row === 'attack' && player.attackRow.length < 4) {
                    player.attackRow.push(card);
                    await logToConsole(`You placed ${card.name} in the attack row.`);
                    player.hand.splice(+cardIndex, 1);
                    actions--;
                } else if (row === 'defense' && player.defenseRow.length < 4) {
                    player.defenseRow.push(card);
                    await logToConsole(`You placed ${card.name} in the defense row.`);
                    player.hand.splice(+cardIndex, 1);
                    actions--;
                } else {
                    await logToConsole('Invalid row or row is full.');
                }
            } else {
                await logToConsole('Invalid card index.');
            }
        } else if (action === 'end') {
            break;
        } else {
            await logToConsole('Invalid action.');
        }
    }
}

async function playerBattlePhase(player: Player, npc: Player, playerFort: Fort, npcFort: Fort, activePlayer: Player, graveyard: Graveyard) {
    await logToConsole('--- Battle Phase ---');

    renderBoard(player, npc, playerFort, npcFort);

    const target = await prompt('Choose target (npc-card, npc-fort): ');
    if (target === 'npc-card') {
        if (npc.attackRow.length > 0 || npc.defenseRow.length > 0) {
            const attackCard = player.attackRow[0]; // Simplified selection
            const defendCard = npc.attackRow[0] || npc.defenseRow[0];

            await logToConsole(`Attacking ${defendCard.name} with ${attackCard.name} (ATK: ${attackCard.attack})`);
            const attackRoll = rollDie(6, activePlayer) + attackCard.attack;
            const defendRoll = rollDie(6, activePlayer) + defendCard.defense;

            await logToConsole(`Your total attack: ${attackRoll}, NPC total defense: ${defendRoll}`);
            if (attackRoll > defendRoll) {
                await logToConsole(`You defeated ${defendCard.name}!`);
                graveyard.cards.push(defendCard);
                if (npc.attackRow.includes(defendCard)) npc.attackRow.splice(npc.attackRow.indexOf(defendCard), 1);
                else npc.defenseRow.splice(npc.defenseRow.indexOf(defendCard), 1);
            } else {
                await logToConsole('Your attack failed!');
            }
        } else {
            await logToConsole('NPC has no cards to attack.');
        }
    } else if (target === 'npc-fort') {
        if (player.attackRow.length > 0) {
            const attackCard = player.attackRow[0]; // Simplified selection
            await logToConsole(`Attacking NPC fort with ${attackCard.name}.`);

            await waitForEnter('Press Enter to roll your dice\n');
            const attackRoll = rollDie(6, activePlayer);

            const attackTotal = attackRoll + attackCard.attack;
            await logToConsole(`\nYour total attack value ${attackTotal}`);

            const defendRoll = rollDie(npcFort.getDefenseDie(), activePlayer);
            await logToConsole(`\nFort total defence is ${defendRoll}`);

            if (attackTotal > defendRoll) {
                npcFort.hitPoints -= attackTotal - defendRoll;
                await logToConsole(`You damaged the fort! NPC Fort HP: ${npcFort.hitPoints}`);
            } else {
                await logToConsole('Your attack on the fort failed!');
            }
        } else {
            await logToConsole('No cards in attack row to attack the fort.');
        }
    }
}

// Main game loop
const gameLoop = async () => {
    await logToConsole('Starting game setup...');
    const deck:FortFelixDeck = new FortFelixDeck();
    const player:Player = new Player('Player');
    const npc:Player = new Player('NPC');
    const playerFort: Fort = new Fort();
    const npcFort: Fort = new Fort();

    var graveyard:Graveyard = new Graveyard();

    var activePlayer: Player;
    var inactivePlayer: Player;

    while (playerFort.hitPoints > 0 && npcFort.hitPoints > 0) {
        // ---Player's Turn----//
        activePlayer = player;
        inactivePlayer = npc;
        await logToConsole("\nYour turn!");

        // Player Draw Phase
        await logToConsole('--- Draw Phase ---');
        await waitForEnter('Press Enter to draw cards\n'); 
        player.drawCards(deck);
        await waitForEnter('Press to enter proceed to the Action Phase\n');

        // Player Action Phase
        await playerActionPhase(player, npc, playerFort, npcFort, activePlayer, graveyard);
        
        // Player Battle Phase
        await waitForEnter('Press enter to proceed to the Battle Phase\n');
        await playerBattlePhase(player, npc, playerFort, npcFort, activePlayer, graveyard);
        
        // ---NPC's Turn---//
        activePlayer = npc;
        inactivePlayer = player;
        await logToConsole("\nNPC's turn!");

        // NPC Draw Phase
        await logToConsole('--- Draw Phase ---');
        npc.drawCards(deck);

        // NPC Action Phase
        await npcActionPhase(player, npc, playerFort, npcFort);

        // Battle Phase
        await npcBattlePhase(activePlayer, inactivePlayer, graveyard);

        // Check win condition
        if (playerFort.hitPoints <= 0) {
            await logToConsole('You lose! NPC wins!');
            break;
        } else if (npcFort.hitPoints <= 0) {
            await logToConsole('You win! NPC fort is destroyed!');
            break;
        }
    }

    await logToConsole('Game over.');
    lineReader.close();
};

gameLoop();