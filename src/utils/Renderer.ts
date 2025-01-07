import { Card } from "../Card";
import { Fort } from "../Fort";
import { Player } from "../Player";

export const formatCardRow = (row: Card[]): string => {
    // Calculate the maximum lengths for name, ATK, and DEF
    const maxNameLength = Math.max(...row.map(card => card.name.length));
    const maxAtkLength = Math.max(...row.map(card => `ATK: ${card.attack}`.length));
    const maxDefLength = Math.max(...row.map(card => `DEF: ${card.defense}`.length));
    
    // Calculate the total padding required to align the columns
    const maxLength = Math.max(maxNameLength, maxAtkLength, maxDefLength);

    // Format each row with dynamic padding to ensure all columns align
    const nameRow = row.map(card => `${card.name}`.padEnd(maxLength + 1)).join(' | ');
    const atkRow = row.map(card => `ATK: ${card.attack}`.padEnd(maxLength + 1)).join(' | ');
    const defRow = row.map(card => `DEF: ${card.defense}`.padEnd(maxLength + 1)).join(' | ');

    return `
| ${nameRow} |
| ${atkRow} |
| ${defRow} |
`;
};

export const renderRow = (row: Card[], label: string): string => {
    const rowContent = formatCardRow(row);
    return `🛡️ ${label}
---------------------------------
${rowContent}
---------------------------------`;
};

export const renderBoard = (player: Player, npc: Player, playerFort: Fort, npcFort: Fort): void => {
    console.log('\n===========================');
    console.log('        FORT FELIX        ');
    console.log('===========================');

    console.log(`Player 2 Fort HP: ${npcFort.hitPoints}`);

    console.log(renderRow(npc.defenseRow, 'DEFENSE ROW'));
    console.log(renderRow(npc.attackRow, 'ATTACK ROW'));

    console.log(renderRow(player.attackRow, 'ATTACK ROW'));
    console.log(renderRow(player.defenseRow, 'DEFENSE ROW'));

    console.log(`Player 1 Fort HP: ${playerFort.hitPoints}`);
    console.log('===========================\n');
};