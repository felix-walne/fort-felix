// Import required libraries
import * as readline from 'readline';
import { Player } from './Player';

export const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const prompt = (query: string): Promise<string> => new Promise((resolve) => lineReader.question(query, resolve));

export const waitForEnter = async (message: string): Promise<void> => {
    await prompt(message);
};

export const rollDie = (sides: number, player: Player): number => {
    const roll = Math.floor(Math.random() * sides) + 1;
    console.log(`${player.name} rolled a D${sides}: ${roll}`);
    return roll;
};

