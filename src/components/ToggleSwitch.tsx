import type { Dispatch, SetStateAction } from "react";
const ToggleSwitch = ({
  armorBuilderSelected,
  setArmorBuilderSelected,
}: {
  armorBuilderSelected: boolean;
  setArmorBuilderSelected: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex justify-between items-center h-12 lg:h-18 bg-gray-300 rounded-t-2xl border border-black">
      <div className="flex gap-3 justify-around h-full">
        <div className="w-4 lg:w-8 bg-[#b57131] rounded-tl-2xl"></div>
        <div className="w-2 lg:w-4 bg-[#29b4b0]"></div>
        <div className="w-2 lg:w-4 bg-[#b57131]"></div>
      </div>
      <div className="w-64 lg:w-72 h-[80%] bg-[#b57131] rounded-3xl p-1">
        <div className="relative flex items-center w-full h-full bg-[#5c5954] rounded-3xl overflow-clip">
          <div className="absolute flex w-full h-full">
            <div
              className={`flex flex-1  transition-all duration-300 ease-in-out rounded-r-2xl ${
                armorBuilderSelected
                  ? "bg-[#29b4b0] scale-x-125 z-20"
                  : "bg-[#5c5954] z-10"
              }`}
            ></div>
            <div
              className={`flex-1 transition-all duration-300 ease-in-out rounded-l-2xl ${
                armorBuilderSelected
                  ? "bg-[#5c5954] z-10"
                  : "bg-[#29b4b0] scale-x-125 z-20"
              }`}
            ></div>
          </div>
          <button
            onClick={() => {
              setArmorBuilderSelected(true);
            }}
            className={`flex-1 text-center  font-bold z-30 font-inter leading-tight transition-all duration-300 text-xs lg:text-sm text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
              armorBuilderSelected ? "opacity-100" : "opacity-40 cursor-pointer"
            }`}
          >
            Armor <br className="hidden lg:block"></br>Builder
          </button>
          <button
            onClick={() => {
              setArmorBuilderSelected(false);
            }}
            className={`flex-1 text-center  font-bold z-30 font-inter leading-tight transition-all duration-300 text-xs lg:text-sm text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
              armorBuilderSelected ? "opacity-40 cursor-pointer" : "opacity-100"
            }`}
          >
            Set <br className="hidden lg:block"></br>Builder
          </button>
        </div>
      </div>
      <div className="flex gap-3 justify-around h-full">
        <div className="w-2 lg:w-4 bg-[#b57131]"></div>
        <div className="w-2 lg:w-4 bg-[#29b4b0]"></div>
        <div className="w-4 lg:w-8 bg-[#b57131] rounded-tr-2xl"></div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
