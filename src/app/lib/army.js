import _ from 'lodash';
import defaultProps from '../config/default-army-props';

export default class Army {
    static parseArmyText(armyText = '', army = new Army()) {
        // console.log('parseArmyText', armyText)

        let i;
        let log = (message) => { army.parseLog.push(message); };
        let name;
        let points;
        let state = null;
        let units = army.units = [];
        let wargear = [];

        function addUnit() {
            // Coerce points to a number.
            points = parseInt(points, 10);

            // Add unit to army.
            units.push({
                name: name,
                points: points,
                wargear: wargear,
            });

            log(
                `Added unit:` +
                `\n\tname: ${name}` +
                `\n\tpoints: ${points}` +
                (wargear.length ? `\n\twargear: ${wargear.join(', ')}` : '') +
                `\n\tarmy points total: ${army.points()}`
            );

            name = undefined;
            points = undefined;
            wargear = [];
        }

        function atEndOfLine() {
            return armyText[i] === '\n';
        }

        function atEndOfText() {
            return i === armyText.length - 1;
        }

        function buildPoints() {
            // Build points string.
            points += armyText[i];

            log(`Built points: ${points}`);
        }

        function recordName() {
             let start = i;

             // Go back to the last '\n'.
             while (start > 0 && armyText[start] !== '\n') {
                start--;
             }

             // Record name.
             name = armyText.substring(start, i).trim();

             log(`Recorded name: ${name}`);
        }

        function recordWargear() {
            let start = i;

            wargear = [];

            // Go back to the last ':'.
            while (start > 0 && armyText[start] !== ':') {
                start--;
            }

            // Step forward 1 to ignore the ':'.
            start++;

            // Record wargear.
            armyText
                .substring(start, i)
                .split(',')
                .map(function (name) {
                    wargear.push(name.trim());
                });

            log(`Recorded wargear: ${wargear}`);
        }

        // Clear parse log for new parse attempt.
        army.parseLog = [];

        for (i = 0; i < armyText.length; i++) {
            // ' - ' denotes the beginning of the points value.
            if (armyText[i] === '-') {
                log(`Found beginning of points value: ${armyText[i]}`);

                if (armyText[i - 1] === ' ' && armyText[i + 1] === ' ') {
                    if (state === null) {
                        recordName();
                    } else if (state === 'in wargear') {
                        recordWargear();
                    }

                    log(`State changed: ${state} -> in points`);

                    state = 'in points';

                    // Prepare string for digit concatenation.
                    points = '';
                }

            // ':' denotes the end of the name and the beginning of the wargear.
            } else if (armyText[i] === ':') {
                log(`Found beginning of wargear: ${armyText[i]}`);

                recordName();

                log(`State change: ${state} -> in wargear`);

                state = 'in wargear';

            // Characters read over while in points must be concatenated
            //     together so they can be parsed as a number later.
            } else if (state === 'in points') {
                if (!atEndOfLine()) {
                    buildPoints();
                }

                // New lines or end of file denote the end of the points value
                //     and also, the end of the unit.
                if (atEndOfLine() || atEndOfText()) {
                    addUnit();

                    log(`State change: ${state} -> null`);

                    state = null;
                }
            }
        }

        army.name = armyText.split('\n')[0];
        army.units = units;
        army.text = armyText;

        // console.log('parseArmyText result', army);

        return army;
    }

    constructor(props = {}) {
        _.assign(this, defaultProps, props);
    }

    parse(armyText = this.text) {
        let parsedArmy = Army.parseArmyText(armyText, this);

        // console.log('==> parse:', armyText);
        // console.log('====> old army:', this);
        // console.log('====> new army:', parsedArmy);

        _.assign(this, parsedArmy);

        // console.log('====> updated army:', parsedArmy);
    }

    points() {
        return this.units.reduce((totalPoints, unit) => {
            return totalPoints + parseInt(unit.points, 10);
        }, 0);
    }

    save() {
        let listTitle = $listTitle.val(),
            list = $list.val();

        lists[listTitle] = list;

        localStorage.setItem('activeListTitle', listTitle);
        localStorage.setItem('lists', JSON.stringify(lists));

        populateListSelector();
    }

    load() {
        let list = JSON.parse(localStorage.getItem('lists'));

        if (typeof listTitle === 'string') {
            return list[listTitle];
        }

        return list;
    }

    // Converters
    toBBCode() {
        let str = '';

        this.units.forEach((unit) => {
            str += '[b]' + unit.name + '[/b]';

            if (unit.wargear && unit.wargear.length) {
                str += ': ' + unit.wargear.join(', ');
            }

            str += ' - ' + unit.points + '\n';
        });

        return str;
    }

    toStr() {
        let str = '';

        this.units.forEach(function (unit) {
            str += unit.name;

            if (unit.wargear && unit.wargear.length) {
                str += ': ' + unit.wargear.join(', ');
            }

            str += ' - ' + unit.points + '\n';
        });

        return str;
    }
}
