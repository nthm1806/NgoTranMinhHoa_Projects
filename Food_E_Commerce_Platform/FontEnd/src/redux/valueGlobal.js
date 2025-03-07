const initialState = {
   valueValueGlobal: {
        currentProducts: []
    },
};

export default function valueGlobalReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET-CURRENT-PRODUCT':
            return { ...state, currentProducts: action.payload  };
        default:
            return state;
    }
}

export const setValueGlobalRedux = (value) => ({ type: 'SET', payload : value });
