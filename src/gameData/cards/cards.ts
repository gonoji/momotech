import { CardAdvance1, CardAdvance2, CardAdvance3, CardAdvance30, CardAdvance4, CardAdvance5, CardAdvance6, CardAdvance7 } from "./cardAdvance";
import { CardDice2, CardDice3, CardDice4, CardDice5 } from "./cardDice";
import { CardDiceAndSpiritRock } from "./cardDiceAndSpiritRock";
import { CardReroll } from "./cardReroll";

export const cards = {
    'Dice2': CardDice2,
    'Dice3': CardDice3,
    'Dice4': CardDice4,
    'Dice5': CardDice5,
    'DiceAndSpiritRock': CardDiceAndSpiritRock,
    'Reroll': CardReroll,
    'Advance1': CardAdvance1,
    'Advance2': CardAdvance2,
    'Advance3': CardAdvance3,
    'Advance4': CardAdvance4,
    'Advance5': CardAdvance5,
    'Advance6': CardAdvance6,
    'Advance7': CardAdvance7,
    'Advance30': CardAdvance30,
} as const;
