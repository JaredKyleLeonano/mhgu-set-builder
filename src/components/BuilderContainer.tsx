import { useState } from "react";
import SetBuilder from "./SetBuilder";
import ArmorBuilder from "./ArmorBuilder";
import ToggleSwitch from "./ToggleSwitch";

const BuilderContainer = () => {
  const [armorBuilderSelected, setArmorBuilderSelected] = useState(true);
  return (
    <div className="flex flex-col flex-7">
      <ToggleSwitch
        armorBuilderSelected={armorBuilderSelected}
        setArmorBuilderSelected={setArmorBuilderSelected}
      ></ToggleSwitch>
      <div className="flex relative bg-[#D4B483B3] border-l border-r border-b border-black h-full">
        <div
          className={`absolute inset-0 p-1 lg:p-4 transition-opacity duration-200 ease-in-out ${armorBuilderSelected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} w-full`}
        >
          <ArmorBuilder></ArmorBuilder>
        </div>
        <div
          className={`absolute inset-0 p-1 lg:p-4 transition-opacity duration-200 ease-in-out ${armorBuilderSelected ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} w-full`}
        >
          <SetBuilder></SetBuilder>
        </div>
      </div>
    </div>
  );
};

export default BuilderContainer;
