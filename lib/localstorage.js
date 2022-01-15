import { useState, useReducer } from "react";
import { ACTIONS } from "pages/index";
import { v4 as uuidv4 } from "uuid";

const reducer = (categories, action) => {
  let returnValue;
  switch (action.type) {
    case ACTIONS.ADD_CATEGORY:
      returnValue = [...categories, newCategory()];
      return returnValue;

    case ACTIONS.DELETE_CATEGORY:
      returnValue = categories.filter(({ id }) => id !== action.payload.id);
      return returnValue;

    case ACTIONS.UPDATE_CATEGORY:
      returnValue = categories.map((category) =>
        category.id === action.payload.id
          ? { ...action.payload }
          : { ...category }
      );
      return returnValue;

    case ACTIONS.DELETE_TODO:
      returnValue = categories.map((category) =>
        category.id === action.payload.catID
          ? {
              ...category,
              todos: category.todos.filter(
                ({ id }) => id !== action.payload.id
              ),
            }
          : { ...category }
      );
      return returnValue;

    case ACTIONS.UPDATE_TODO:
      returnValue = categories.map((category) =>
        category.id === action.payload.catID
          ? {
              ...category,
              todos: category.todos.map((todo) =>
                todo.id === action.payload.item.id
                  ? { ...action.payload.item }
                  : { ...todo }
              ),
            }
          : { ...category }
      );
      return returnValue;

    default:
      throw new Error();
  }
  localStorage.setItem("categories", JSON.stringify(returnValue));
};

const newCategory = () => {
  return {
    id: uuidv4(),
    name: "",
    todos: [
      {
        id: uuidv4(),
        name: "",
        text: "",
        completed: false,
      },
    ],
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [state, dispatch] = useReducer(
    reducer,
    (() => {
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem("categories");

        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    })()
  );

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [state, dispatch];
};
