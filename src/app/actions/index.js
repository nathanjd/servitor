export const addArmy = (army = new Army()) => {
    return {
        type: 'ADD_ARMY',
        army: army
    };
}
