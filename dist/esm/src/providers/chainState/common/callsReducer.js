/**
 * @internal Intended for internal use - use it on your own risk
 */
export function callsReducer(state = [], action) {
    if (action.type === 'ADD_CALLS') {
        return [...state, ...action.calls.map((call) => (Object.assign(Object.assign({}, call), { address: call.address.toLowerCase() })))];
    }
    else if (action.type === 'UPDATE_CALLS') {
        return state.map((call) => {
            if (call.chainId !== action.chainId) {
                return call;
            }
            const blockNumber = action.blockNumber;
            if (call.refreshPerBlocks && call.lastUpdatedBlockNumber) {
                return call.lastUpdatedBlockNumber + call.refreshPerBlocks === blockNumber
                    ? Object.assign(Object.assign({}, call), { lastUpdatedBlockNumber: blockNumber, isDisabled: false }) : Object.assign(Object.assign({}, call), { isDisabled: true });
            }
            return call.isStatic
                ? Object.assign(Object.assign({}, call), { isDisabled: true }) : Object.assign(Object.assign({}, call), { lastUpdatedBlockNumber: blockNumber, isDisabled: call.refreshPerBlocks !== undefined ? true : false });
        });
    }
    else {
        let finalState = state;
        for (const call of action.calls) {
            const index = finalState.findIndex((x) => x.address.toLowerCase() === call.address.toLowerCase() && x.data === call.data);
            if (index !== -1) {
                finalState = finalState.filter((_, i) => i !== index);
            }
        }
        return finalState;
    }
}
//# sourceMappingURL=callsReducer.js.map