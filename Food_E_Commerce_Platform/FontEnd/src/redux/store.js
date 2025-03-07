import { combineReducers, createStore } from 'redux';
import filterSeachReducer from './filterSearch';
import valueGlobalReducer from './valueGlobal';

const rootReducer = combineReducers({
    filterSearch: filterSeachReducer, 
    valueGlobal: valueGlobalReducer    
});

// Tạo store với reducer kết hợp
const store = createStore(rootReducer);


export default store;