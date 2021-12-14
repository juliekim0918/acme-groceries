import { applyMiddleware, createStore, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import axios from "axios";

const initialState = {
  groceries: [],
  view: "",
};

const _updateGrocery = (grocery) => {
  return {
    type: "UPDATE",
    grocery,
  };
};

export const updateGrocery = (grocery) => {
  return async (dispatch) => {
    const updatedGrocery = (
      await axios.put(`/api/groceries/${grocery.id}`, {
        purchased: !grocery.purchased,
      })
    ).data;
    dispatch(_updateGrocery(updatedGrocery));
  };
};

const _createGrocery = (grocery) => {
  return {
    type: "CREATE",
    grocery,
  };
};

export const createGrocery = (name) => {
  return async (dispatch) => {
    let newItem;
    name
      ? (newItem = (await axios.post("/api/groceries", { name })).data)
      : (newItem = (await axios.post("/api/groceries/random")).data);
    dispatch(_createGrocery(newItem));
  };
};

const _bootstrap = (groceries) => {
  return {
    type: "LOAD",
    groceries,
  };
};

export const bootstrap = () => {
  return async (dispatch) => {
    const groceries = (await axios.get("/api/groceries")).data;
    console.log(groceries);
    dispatch(_bootstrap(groceries));
  };
};

const _deleteGrocery = (grocery) => {
  return {
    type: "DELETE",
    grocery,
  };
};

export const deleteGrocery = (id) => {
  return async (dispatch) => {
    const groceryToDelete = (await axios.get(`/api/groceries/${id}`)).data;
    console.log(groceryToDelete, "this is grocery to delete");
    dispatch(_deleteGrocery(groceryToDelete));
  };
};

const groceriesReducer = (state = [], action) => {
  console.log(action, "this is action");
  switch (action.type) {
    case "LOAD":
      return action.groceries;
    case "UPDATE":
      return state.map((grocery) =>
        grocery.id === action.grocery.id ? action.grocery : grocery
      );
    case "CREATE":
      return [...state, action.grocery];
    case "DELETE":
      return state.map((grocery) => grocery.id !== action.grocery.id);
    default:
      return state;
  }
};

const viewReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_VIEW":
      return action.view;
    default:
      return state;
  }
};

const reducer = combineReducers({
  groceries: groceriesReducer,
  view: viewReducer,
});

const store = createStore(reducer, applyMiddleware(logger, thunk));

export default store;
