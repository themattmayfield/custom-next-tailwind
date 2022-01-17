import RenderCurrentThemeChanger from "components/RenderCurrentThemeChanger";

const Header = () => {
  return (
    <div className="top-0 z-10 flex-shrink-0 px-4 sm:px-6 lg:px-8 flex items-center h-16 bg-[#EDF2F7]/50 dark:bg-[#070707]/50 backdrop-blur-[2px] border-b border-gray-200 dark:border-todoDark justify-between">
      <div className="w-full inline-flex items-center">
        {/* <p>🚀</p> */}
        <p className="ml-4 text-sm sm:text-base font-bold">My todolist</p>
      </div>

      <div className="flex justify-end w-full">
        {RenderCurrentThemeChanger()}
      </div>
    </div>
  );
};

export default Header;
