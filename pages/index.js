import Layout from "components/Layout";
import SubHeader from "components/SubHeader";
import { useLocalStorage, ACTIONS } from "lib/localstorage";

export default function Home() {
  const [categories, dispatch] = useLocalStorage("categories", []);

  return (
    <Layout>
      <SubHeader dispatch={dispatch} />
      {/* {JSON.stringify(categories)} */}

      <CategoryContainer>
        {categories.map((category, idx) => (
          <Category key={idx} category={category} dispatch={dispatch} />
        ))}
      </CategoryContainer>
    </Layout>
  );
}

const CategoryContainer = ({ children }) => (
  <div className="flex items-start gap-x-4 sm:gap-x-8 py-6 w-full overflow-x-scroll">
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
          type: ACTIONS.ADD_TODO,
          payload: { id: category.id },
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
