import { map } from 'lodash';

import { parseArmyText } from './army';

import defaultRawArmies from '../config/default-raw-armies';

function getAll() {
    let rawArmies;
    let rawArmiesText = localStorage.getItem('armies');

    try {
        rawArmies = JSON.parse(rawArmiesText);
    } catch (error) {
        console.error('Error parsing rawArmiesText:', error);
    }

    if (!Array.isArray(rawArmies)) {
        rawArmies = defaultRawArmies;
    }

    return map(rawArmies, (rawArmy) => {
        return parseArmyText(rawArmy.text);
    });
}

function resetToDefault() {
    save(defaultRawArmies);
}

function save(armies) {
    if (!Array.isArray(armies)) {
        console.log('Escaping from bad army save', Array.isArray(armies));

        return;
    }

    localStorage.setItem('armies', JSON.stringify(armies));
}

module.exports = {
    getAll: getAll,
    resetToDefault: resetToDefault,
    save: save,
};
