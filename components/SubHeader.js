import React from "react";
import { ACTIONS } from "pages/index";
const SubHeader = ({ dispatch }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-2xl font-bols">Projects</p>
      <button
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_CATEGORY,
          })
        }
      >
        Add Category
      </button>
    </div>
  );
};

export default SubHeader;
