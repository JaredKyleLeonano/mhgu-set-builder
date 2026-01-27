import { useAppContext } from "./Hooks/UseAppContext";
import { useMemo } from "react";
const OverallStats = () => {
  const { selectedArmor } = useAppContext();

  const stats = useMemo(() => {
    return Object.values(selectedArmor).reduce(
      (acc, armor) => {
        acc.minDef += armor?.defense.min ?? 0;
        acc.maxDef += armor?.defense.max ?? 0;
        acc.fireRes += armor?.elemRes.fire ?? 0;
        acc.waterRes += armor?.elemRes.water ?? 0;
        acc.thunderRes += armor?.elemRes.thunder ?? 0;
        acc.iceRes += armor?.elemRes.ice ?? 0;
        acc.dragonRes += armor?.elemRes.dragon ?? 0;

        if (armor && armor?.slots > 0) {
          acc.slots.push("O".repeat(armor.slots) + "-".repeat(3 - armor.slots));
        }

        return acc;
      },
      {
        minDef: 0,
        maxDef: 0,
        fireRes: 0,
        waterRes: 0,
        thunderRes: 0,
        iceRes: 0,
        dragonRes: 0,
        slots: [] as string[],
      },
    );
  }, [selectedArmor]);
  return (
    <div className="flex lg:block flex-1 flex-col">
      <h4 className="w-full text-sm lg:text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
        Overall Stats
      </h4>
      <div
        className={`flex flex-[0px] overflow-auto flex-col justify-around items-start px-2 text-xs lg:text-lg rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a86f39] focus:outline-none focus:ring-0`}
      >
        <p className="lg:hidden">
          Defense: {stats.minDef} - {stats.maxDef}
        </p>
        <div className="hidden lg:flex flex-col">
          <p>Min Defense: {stats.minDef}</p>
          <p>Max Defense: {stats.maxDef}</p>
        </div>
        <div>
          <p>Elemental Resistance:</p>
          <div className="grid grid-rows-2 grid-cols-3 gap-x-4 lg:flex items-center lg:gap-4">
            <div className="flex items-center">
              <img className="h-4 w-4" src="/assets/images/fire.webp"></img>
              <p>:{stats.fireRes}</p>
            </div>
            <div className="row-start-2 col-start-1 flex items-center">
              <img className="h-4 w-4" src="/assets/images/water.webp"></img>
              <p>:{stats.waterRes}</p>
            </div>
            <div className="row-start-1 col-start-2 flex items-center">
              <img className="h-4 w-4" src="/assets/images/thunder.webp"></img>
              <p>:{stats.thunderRes}</p>
            </div>
            <div className="row-start-2 col-start-2 flex items-center">
              <img className="h-4 w-4" src="/assets/images/ice.webp"></img>
              <p>:{stats.iceRes}</p>
            </div>
            <div className="flex items-center">
              <img className="h-4 w-4" src="/assets/images/dragon.webp"></img>
              <p>:{stats.dragonRes}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-2">
          <p>Slots:</p>
          <p>{stats.slots.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallStats;
