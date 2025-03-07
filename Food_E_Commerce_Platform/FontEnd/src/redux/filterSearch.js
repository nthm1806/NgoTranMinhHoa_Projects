const initialState = {
   valueFilter: {
        keyword: ''
    },
};

export default function filterSeachReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET':
            return { ...state, keyword: action.payload  };
        default:
            return state;
    }
}

export const setFilterSearchRedux = (value) => ({ type: 'SET', payload : value });
