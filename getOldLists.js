(function () {
    'use strict';

    let armies = JSON.parse(localStorage.getItem('lists')),
        translatedArmies = Object.keys(armies).sort().map((name) => {
            return {
                name: name,
                text: armies[name]
            }
        });

    return JSON.stringify(translatedArmies);
})();
