import { useMemo } from "react";
import { useAppContext } from "./Hooks/UseAppContext";
import type { ArmorItem } from "../types";

const SetList = ({
  armorResults,
  searchResult,
}: {
  armorResults: ArmorItem[][];
  searchResult: string;
}) => {
  const { setSelectedArmor, setAccumulatedSkills } = useAppContext();

  const armorsToDisplay = useMemo(() => {
    return armorResults.sort((a, b) => {
      const aDef = a.reduce((acc, armor) => {
        acc += armor.defense.min;
        return acc;
      }, 0);

      const bDef = b.reduce((acc, armor) => {
        acc += armor.defense.min;
        return acc;
      }, 0);

      return bDef - aDef;
    });
  }, [armorResults]);
  return (
    <div className="flex flex-col h-full w-full font-inter">
      <h4 className=" font-inter text-sm lg:text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
        Armor Sets
      </h4>
      <div className="flex flex-col flex-1 bg-black/70">
        <div className="flex-[0px] flex flex-col gap-2 overflow-y-auto px-1 py-2 lg:px-4 mask-alpha mask-t-from-99% mask-t-from-black mask-t-to-transparent mask-b-from-98% mask-b-from-black mask-b-to-transparent">
          {armorsToDisplay.length > 0 ? (
            armorsToDisplay.map((armorSets, i) => {
              const defense = armorSets.reduce(
                (acc, armor) => {
                  acc.min += armor.defense.min;
                  acc.max += armor.defense.max;
                  return acc;
                },
                { min: 0, max: 0 },
              );
              const elemRes = armorSets.reduce(
                (acc, armor) => {
                  acc.fire += armor.elemRes.fire;
                  acc.water += armor.elemRes.water;
                  acc.thunder += armor.elemRes.thunder;
                  acc.ice += armor.elemRes.ice;
                  acc.dragon += armor.elemRes.dragon;
                  return acc;
                },
                { fire: 0, water: 0, thunder: 0, ice: 0, dragon: 0 },
              );
              const slots = armorSets.reduce<number[]>((acc, armor) => {
                if (armor.slots) acc.push(armor.slots);
                return acc;
              }, []);
              return (
                <button
                  key={`${armorSets}_${i}`}
                  onClick={() => {
                    setSelectedArmor(() => ({
                      Head: armorSets[0],
                      Torso: armorSets[1],
                      Arms: armorSets[2],
                      Waist: armorSets[3],
                      Legs: armorSets[4],
                    }));
                    setAccumulatedSkills(() => ({
                      Head: armorSets[0].skills,
                      Torso: armorSets[1].skills,
                      Arms: armorSets[2].skills,
                      Waist: armorSets[3].skills,
                      Legs: armorSets[4].skills,
                    }));
                  }}
                  className="flex lg:flex-col w-full gap-4 rounded-2xl p-4 bg-[#D6C9AD] hover:bg-[#C8BA9D] transition-all duration-300 ease-out cursor-pointer text-xs"
                >
                  <div className="flex flex-col gap-1">
                    {armorSets.map((armor, i) => (
                      <div
                        key={`${armor.armor}_${i}`}
                        className="flex w-full gap-4"
                      >
                        <img
                          className="h-6 w-6"
                          src={`/assets/images/${armor.armorPiece}_${armor.rarity}.webp`}
                        ></img>
                        <p className="font-semibold">{armor.armor}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-start flex-1 gap-4 lg:gap-1">
                    <div className="flex">
                      <p>
                        Defense: {defense.min} - {defense.max}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 lg:flex gap-1 lg:gap-4">
                      {Object.entries(armorSets[0].elemRes).map((elem, i) => {
                        console.log("ELEM", elem, "RES", elem);
                        return (
                          <div
                            key={`${elem}_${i}`}
                            className="flex items-center"
                          >
                            <img
                              key={`${elem}_${i}`}
                              className="h-4 w-4"
                              src={`/assets/images/${elem[0]}.webp`}
                              loading="eager"
                              decoding="sync"
                            ></img>
                            <p>: {elemRes[elem[0] as keyof typeof elemRes]}</p>
                          </div>
                        );
                      })}
                    </div>
                    <p>
                      Slots:{" "}
                      {slots.map((slot, i) => (
                        <span key={`${slot}_${i}`}>
                          {"O".repeat(slot) + "-".repeat(3 - slot)}
                          {i !== slots.length - 1 && ", "}
                        </span>
                      ))}{" "}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <button className="flex flex-col w-full gap-4 rounded-2xl p-4 bg-[#D6C9AD] hover:bg-[#C8BA9D] transition-all duration-300 ease-out cursor-pointer text-xs">
              <p>{searchResult}</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetList;
