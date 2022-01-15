import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const ACTIONS = {
  ADD_CATEGORY: "add-category",
  DELETE_CATEGORY: "delete-category",
  UPDATE_CATEGORY: "update-category",
  ADD_TODO: "add-todo",
  DELETE_TODO: "delete-todo",
  UPDATE_TODO: "update-todo",
};

const structure = [
  {
    id: 0,
    name: "cat1",
    todos: [
      {
        id: 1,
        name: "coook",
        text: "sometihng about cooking",
        completed: false,
      },
    ],
  },
];

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
const newTodo = () => {
  return {
    id: uuidv4(),
    name: "",
    text: "",
    completed: false,
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  const actionHandler = (action) => {
    switch (action.type) {
      case ACTIONS.ADD_CATEGORY:
        return [...storedValue, newCategory()];

      case ACTIONS.DELETE_CATEGORY:
        return storedValue.filter(({ id }) => id !== action.payload.id);

      case ACTIONS.UPDATE_CATEGORY:
        return storedValue.map((category) =>
          category.id === action.payload.id
            ? { ...action.payload }
            : { ...category }
        );

      case ACTIONS.ADD_TODO:
        return storedValue.map((category) =>
          category.id === action.payload.id
            ? {
                ...category,
                todos: [...category.todos, newTodo()],
              }
            : { ...category }
        );

      case ACTIONS.DELETE_TODO:
        return storedValue.map((category) =>
          category.id === action.payload.catID
            ? {
                ...category,
                todos: category.todos.filter(
                  ({ id }) => id !== action.payload.id
                ),
              }
            : { ...category }
        );

      case ACTIONS.UPDATE_TODO:
        return storedValue.map((category) =>
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

      default:
        return storedValue;
    }
  };

  const setValue = (action) => {
    try {
      const returnValue = actionHandler(action);

      setStoredValue(returnValue);

      window.localStorage.setItem(key, JSON.stringify(returnValue));
    } catch (error) {
      // handle error better
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
