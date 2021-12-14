import React from "react";
import axios from "axios";
import { updateGrocery, createGrocery, deleteGrocery } from "./store";
import { connect } from "react-redux";

const _Groceries = ({ groceries, view, toggle, create, deleteGrocery }) => {
  return (
    <div>
      <button onClick={create}>Create</button>
      <ul>
        {groceries
          .filter(
            (grocery) =>
              !view ||
              (grocery.purchased && view === "purchased") ||
              (!grocery.purchased && view === "needs")
          )
          .map((grocery) => {
            return (
              <li
                onClick={() => toggle(grocery)}
                key={grocery.id}
                className={grocery.purchased ? "purchased" : ""}
              >
                {grocery.name}
                <button onClick={() => deleteGrocery(grocery.id)}>X</button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: (grocery) => {
      dispatch(updateGrocery(grocery));
    },
    // create: () => {
    //   dispatch(createGrocery());
    // },
    deleteGrocery: (id) => {
      dispatch(deleteGrocery(id));
    },
  };
};

const Groceries = connect((state) => state, mapDispatchToProps)(_Groceries);

export default Groceries;
