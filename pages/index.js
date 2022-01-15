import { useReducer, useState, useEffect } from "react";
import Layout from "components/Layout";
import SubHeader from "components/SubHeader";
import { useLocalStorage } from "lib/localstorage";
import { v4 as uuidv4 } from "uuid";

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

// const initialState = window.localStorage.getItem("categories") || [];

export const ACTIONS = {
  ADD_CATEGORY: "add-category",
  DELETE_CATEGORY: "delete-category",
  UPDATE_CATEGORY: "update-category",
  DELETE_TODO: "delete-todo",
  UPDATE_TODO: "update-todo",
};

const newTodo = () => {
  return {
    id: uuidv4(),
    name: "",
    text: "",
    completed: false,
  };
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

const reducer = (categories, action) => {
  let returnValue;
  switch (action.type) {
    case ACTIONS.ADD_CATEGORY:
      returnValue = [...categories, newCategory()];
      localStorage.setItem("categories", JSON.stringify(returnValue));
      return returnValue;

    case ACTIONS.DELETE_CATEGORY:
      returnValue = categories.filter(({ id }) => id !== action.payload.id);
      localStorage.setItem("categories", JSON.stringify(returnValue));
      return returnValue;

    case ACTIONS.UPDATE_CATEGORY:
      returnValue = categories.map((category) =>
        category.id === action.payload.id
          ? { ...action.payload }
          : { ...category }
      );
      localStorage.setItem("categories", JSON.stringify(returnValue));
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
      localStorage.setItem("categories", JSON.stringify(returnValue));
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
      localStorage.setItem("categories", JSON.stringify(returnValue));
      return returnValue;

    default:
      throw new Error();
  }
};

export default function Home() {
  const [categories, setCategories] = useLocalStorage("categories", []);
  const [state, dispatch] = useReducer(reducer, categories);

  const [test, setTest] = useState([]);
  console.log(test);
  useEffect(() => {
    const items = localStorage.getItem("categories");
    const parsedItems = JSON.parse(items);

    setTest(parsedItems);
  }, []);

  return (
    <Layout>
      <SubHeader dispatch={dispatch} />
      {JSON.stringify(state)}

      <CategoryContainer>
        {test.map((category, idx) => (
          <Category key={idx} category={category} dispatch={dispatch} />
        ))}
      </CategoryContainer>
    </Layout>
  );
}

const CategoryContainer = ({ children }) => (
  <div className="flex items-start gap-4 sm:gap-24 py-6 w-full overflow-x-scroll">
    {/* <div className="snap-x snap-mandatory grid grid-rows-1 grid-flow-col gap-4 sm:gap-24 py-6 w-full overflow-x-scroll"> */}
    {children}
  </div>
);

const Category = ({ category, dispatch }) => (
  <div className="bg-slate-600 rounded-lg px-2 py-4 w-[340px] max-h-fit mx-auto flex-shrink-0">
    <div className="flex items-center justify-between">
      <input
        value={category.name}
        onChange={(e) =>
          dispatch({
            type: ACTIONS.UPDATE_CATEGORY,
            payload: { ...category, name: e.target.value },
          })
        }
      />
      <button
        onClick={() =>
          dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: category })
        }
      >
        delete
      </button>
    </div>
    <button
      onClick={() =>
        dispatch({
          type: ACTIONS.UPDATE_CATEGORY,
          payload: { ...category, todos: [...category.todos, newTodo()] },
        })
      }
      className="bg-green-400 w-full py-1 rounded-lg my-2"
    >
      +
    </button>
    <div className="space-y-6">
      {category.todos.map((item) => (
        <div key={item.id} className="bg-blue-400 h-56 rounded-lg">
          <input
            value={item.name}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.UPDATE_TODO,
                payload: {
                  catID: category.id,
                  item: { ...item, name: e.target.value },
                },
              })
            }
          />
        </div>
      ))}
    </div>
  </div>
);
