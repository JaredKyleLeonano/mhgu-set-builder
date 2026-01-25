import { useAppContext } from "./Hooks/UseAppContext";

const OverallStats = () => {
  const { selectedArmor } = useAppContext();
  return (
    <div className="flex flex-col">
      <h4 className="w-full text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
        Overall Stats
      </h4>
      <div
        className={`flex flex-col items-start px-2 text-lg rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a86f39] focus:outline-none focus:ring-0`}
      >
        <p>
          Total Min Defense:{" "}
          {Object.values(selectedArmor).reduce(
            (acc, armor) => acc + (armor?.defense.min ?? 0),
            0,
          )}
        </p>
        <p>
          Total Max Defense:{" "}
          {Object.values(selectedArmor).reduce(
            (acc, armor) => acc + (armor?.defense.max ?? 0),
            0,
          )}
        </p>
        <p>Total Elemental Resistance:</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img className="h-4 w-4" src="/assets/images/fire.webp"></img>
            <p>
              :
              {Object.values(selectedArmor).reduce(
                (acc, armor) => acc + (armor?.elemRes.fire ?? 0),
                0,
              )}
            </p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4" src="/assets/images/water.webp"></img>
            <p>
              :
              {Object.values(selectedArmor).reduce(
                (acc, armor) => acc + (armor?.elemRes.water ?? 0),
                0,
              )}
            </p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4" src="/assets/images/thunder.webp"></img>
            <p>
              :
              {Object.values(selectedArmor).reduce(
                (acc, armor) => acc + (armor?.elemRes.thunder ?? 0),
                0,
              )}
            </p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4" src="/assets/images/ice.webp"></img>
            <p>
              :
              {Object.values(selectedArmor).reduce(
                (acc, armor) => acc + (armor?.elemRes.ice ?? 0),
                0,
              )}
            </p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4" src="/assets/images/dragon.webp"></img>
            <p>
              :
              {Object.values(selectedArmor).reduce(
                (acc, armor) => acc + (armor?.elemRes.dragon ?? 0),
                0,
              )}
            </p>
          </div>
        </div>
        <p>
          Total Slots:{" "}
          {Object.values(selectedArmor)
            .flatMap((armor) => {
              if (armor) {
                return armor.slots != 0
                  ? "O".repeat(armor.slots) + "-".repeat(3 - armor.slots)
                  : null;
              }
            })
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>
    </div>
  );
};

export default OverallStats;
