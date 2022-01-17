import { useRef, useEffect, useState } from "react";
import Layout from "components/Layout";
import SubHeader from "components/SubHeader";
import { useLocalStorage, ACTIONS } from "lib/localstorage";
import {
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/solid";

const handleKeyDown = (e) => {
  e.target.style.height = "inherit";
  e.target.style.height = `${e.target.scrollHeight}px`;
  // In case you have a limitation
  // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
};

export default function Home() {
  const [categories, dispatch] = useLocalStorage("categories", []);
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <Layout>
      <SubHeader dispatch={dispatch} />
      {/* {JSON.stringify(categories)} */}

      <div className="relative flex-grow">
        <CategoryContainer>
          {categories.map((category, idx) => (
            <div
              key={category.id}
              className="h-full whitespace-nowrap align-top"
            >
              <Category
                firstRender={firstRender}
                key={idx}
                category={category}
                dispatch={dispatch}
              />
            </div>
          ))}
        </CategoryContainer>
      </div>
    </Layout>
  );
}

const CategoryContainer = ({ children }) => {
  return (
    <div className="flex items-start gap-x-4 sm:gap-x-8 py-6 w-full overflow-x-scroll overflow-y-hidden pb-8 mb-8 absolute bottom-0 left-0 right-0 top-0 whitespace-nowrap flex-grow">
      {children}
    </div>
  );
};

const Category = ({ category, dispatch, firstRender }) => {
  const ref = useRef();

  useEffect(() => {
    if (firstRender.current === false && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [firstRender]);

  return (
    <div
      ref={ref}
      className="bg-slate-200 dark:bg-todoDark/50 rounded-xl px-3 py-4 w-[340px] mx-auto flex flex-col max-h-full relative whitespace-normal"
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          <CustomInput
            placeholder="Title"
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
            <TrashIcon className="h-5 w-5 text-gray-500 dark:text-zinc-700 hover:text-gray-600/60 dark:hover:text-zinc-700/50 hover:text-opacity-60 transition duration-300 ease-in-out" />
          </button>
        </div>
        <button
          onClick={() =>
            dispatch({
              type: ACTIONS.ADD_TODO,
              payload: { id: category.id },
            })
          }
          className="bg-slate-300 dark:bg-zinc-900 hover:bg-slate-400/40 dark:hover:bg-opacity-60 transition duration-300 ease-in-out w-full py-1.5 rounded-lg my-3 flex justify-center"
        >
          <PlusIcon className="h-5 w-5 text-gray-500 dark:text-zinc-700" />
        </button>
      </div>
      <div className="space-y-6 flex-auto min-h-0 overflow-y-auto ">
        {category.todos.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-black p-2 h-auto rounded-lg"
          >
            <div className="flex items-center justify-between">
              <CustomInput
                placeholder="Todo title"
                className="ml-3 font-medium"
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
              <button
                onClick={(e) =>
                  dispatch({
                    type: ACTIONS.UPDATE_TODO,
                    payload: {
                      catID: category.id,
                      item: { ...item, completed: !item.completed },
                    },
                  })
                }
                className="text-xs"
              >
                {item.completed ? (
                  <CheckCircleIcon className="h-5 w-5 text-gray-500 dark:text-zinc-700 hover:text-gray-600/60 dark:hover:text-zinc-700/50 hover:text-opacity-60 transition duration-300 ease-in-out" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-500 dark:text-zinc-700 hover:text-gray-600/60 dark:hover:text-zinc-700/50 hover:text-opacity-60 transition duration-300 ease-in-out" />
                )}
              </button>
            </div>
            <textarea
              // placeholder="Todo info"
              className="mt-1 w-full bg-transparent h-auto border-none text-gray-600"
              onKeyDown={handleKeyDown}
              value={item.text}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.UPDATE_TODO,
                  payload: {
                    catID: category.id,
                    item: { ...item, text: e.target.value },
                  },
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomInput = (props) => (
  <input
    {...props}
    className={`${props.className} bg-transparent focus:px-1`}
  />
);
