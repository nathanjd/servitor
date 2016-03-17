import { combineReducers } from 'redux';
import todos from './todos';
import visibilityFilter from './visibilityFilter';

import Army from '../lib/army';

const army = (state, action) => {
    switch (action.type) {
        case 'ADD_ARMY':
            return new Army();
    }
};

const armies = (state, action) => {
    switch (action.type) {
        case 'ADD_ARMY':
            return [
                army(undefined, action),
                ...state
            ];
        case 'ARMY_TEXT_CHANGE':

    }
};

const servitorApp = combineReducers({
  armies,
});

export default servitorApp;
