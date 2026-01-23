import {
  getByRarity,
  groupByArmorPieceAndType,
  maxSkillPossible,
  getFilteredArmors,
  type ArmorItem,
  type SkillType,
  type SkillMap,
} from "../queries";
import { useEffect, useMemo, useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SkillList from "./SkillList";
type SkillTreeMap = Record<string, { type: string; details: SkillType[] }>;

type PieceType = {
  Head: ArmorItem | null;
  Torso: ArmorItem | null;
  Arms: ArmorItem | null;
  Waist: ArmorItem | null;
  Legs: ArmorItem | null;
};

type AccumulatedSkillsType = {
  Head: SkillType[] | null;
  Torso: SkillType[] | null;
  Arms: SkillType[] | null;
  Waist: SkillType[] | null;
  Legs: SkillType[] | null;
};

type SkillTreeType = {
  skillTree: string;
  type: string;
  details: SkillType[];
};

type CompiledSkillsType = Record<string, number[]>;

const SetBuilder = ({
  selectedArmor,
  setSelectedArmor,
  allSkills,
  accumulatedSkills,
  setAccumulatedSkills,
}: {
  selectedArmor: PieceType;
  setSelectedArmor: Dispatch<SetStateAction<PieceType>>;
  allSkills: SkillTreeMap;
  accumulatedSkills: AccumulatedSkillsType;
  setAccumulatedSkills: Dispatch<SetStateAction<AccumulatedSkillsType>>;
}) => {
  const armorSortMap: Record<string, number> = useMemo(
    () => ({
      Head: 0,
      Torso: 1,
      Arms: 2,
      Waist: 3,
      Legs: 4,
    }),
    [],
  );

  const skillCategoryArray = useMemo(() => {
    return [
      "Survival",
      "Item",
      "Quest",
      "Negate",
      "Parameter Change",
      "Attack",
      "Multi Skill",
    ];
  }, []);

  const [skillRows, activatedCount] = useMemo(() => {
    // console.log("ACCUMULATED SKILLS", accumulatedSkills);
    const compiledSkills: CompiledSkillsType = {};
    const rows = [];
    let count = 0;

    for (const [piece, skills] of Object.entries(accumulatedSkills)) {
      if (skills) {
        for (const skill of skills) {
          if (!compiledSkills[skill.name]) {
            compiledSkills[skill.name] = Array(6).fill(undefined);
          }
          compiledSkills[skill.name][armorSortMap[piece]] = skill.level;
        }
      }
    }

    for (const [skillTree, levels] of Object.entries(compiledSkills)) {
      levels[5] = levels.reduce((acc, level) => acc + (level ?? 0), 0);

      let activated = undefined;
      for (const details of allSkills[skillTree].details) {
        // console.log("DETAILS ARE:", details);
        // console.log("SKILL NAME:", details.name, "SKILL LEVEL:", details.level);
        if (details.level > 0 && levels[5] >= details.level) {
          //   console.log("THIS RAN INSIDE ACTIVATE LOOP");
          activated = details.name;
          break;
        }
      }
      //   console.log("ACTIVATED SKILL IS", activated);
      if (activated) {
        rows.unshift([skillTree, ...levels, activated]);
        count++;
      } else {
        rows.push([skillTree, ...levels, activated]);
      }
    }
    // console.log("COMPILED SKILLS ARE:", compiledSkills);
    // console.log("ROWS ARE:", rows);
    return [rows, count];
  }, [accumulatedSkills, armorSortMap, allSkills]);

  const [searchFilter, setSearchFilter] = useState("");

  const [typeFilter, setTypeFilter] = useState<Record<string, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, SkillType>
  >({});
  // const filterSkills = useMemo(() => {
  //   const skillCategoryMap: Record<string, SkillTreeType[]> = {
  //     Survival: [],
  //     Item: [],
  //     Quest: [],
  //     Negate: [],
  //     "Parameter Change": [],
  //     Attack: [],
  //     "Multi Skill": [],
  //   };

  //   Object.entries(allSkills).forEach(([key, value]) => {
  //     console.log("INSIDE LOOP");
  //     console.log("KEY IS", key);
  //     console.log("VALUE IS:", value);
  //     for (const skill of value.details) {
  //       if (
  //         skill.level > 0 &&
  //         (!searchFilter ||
  //           skill.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
  //           key.toLowerCase().includes(searchFilter.toLowerCase()))
  //       ) {
  //         skillCategoryMap[value.type].push({
  //           skillTree: key,
  //           type: value.type,
  //           details: value.details,
  //         });
  //       }
  //     }
  //   });

  //   return skillCategoryMap;
  // }, [allSkills, searchFilter]);

  // const [openTabs, setOpentabs] = useState({
  //   Survival: false,
  //   Item: false,
  //   Quest: false,
  //   Negate: false,
  //   "Parameter Change": false,
  //   Attack: false,
  //   "Multi Skill": false,
  // });

  // const prevSearchRef = useRef("");

  // useEffect(() => {
  //   (async () => {
  //     const prevSearch = prevSearchRef.current;

  //     if (prevSearch && !searchFilter) {
  //       for (const category of skillCategoryArray) {
  //         setOpentabs((prev) => ({
  //           ...prev,
  //           [category]: false,
  //         }));
  //       }
  //     }
  //     for (const category of skillCategoryArray) {
  //       if (searchFilter && filterSkills[category].length > 0) {
  //         setOpentabs((prev) => ({
  //           ...prev,
  //           [category]: true,
  //         }));
  //       } else if (searchFilter && filterSkills[category].length <= 0) {
  //         setOpentabs((prev) => ({
  //           ...prev,
  //           [category]: false,
  //         }));
  //       }
  //     }

  //     prevSearchRef.current = searchFilter;
  //   })();
  // }, [openTabs, setOpentabs, filterSkills, searchFilter, skillCategoryArray]);

  // useEffect(() => {
  //   // for (const [key, value] of Object.entries(allSkills)) {
  //   //   console.log("KEY", key);
  //   //   console.log("VCALEU", value);
  //   // }
  //   // console.log("THESE ARE ALL OF THE SKILL:", allSkills);
  //   // console.log("THESE ARE THE OPEN TABS", openTabs);
  // }, [openTabs, allSkills]);
  const [rankFilter, setRankFilter] = useState(11);

  const listDivRef = useRef<HTMLDivElement>(null);
  const [armorResults, setArmorResults] = useState<ArmorItem[][]>([]);
  useEffect(() => {
    console.log("ARMOR RESULTS ARE:", armorResults);
  }, [armorResults]);

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
    <div className="flex h-full w-full justify-between gap-4 font-inter">
      <div className="flex flex-col flex-2">
        <div className="flex rounded-t-xl bg-[#3A2623] px-2 py-1">
          <h4 className="flex-1 whitespace-nowrap text-2xl text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
            Skill List
          </h4>
          <input
            className={`w-[60%] px-2 text-sm rounded-lg border-2 bg-[#D6C9AD] border-[#a86f39] focus:outline-none focus:ring-0`}
            placeholder="Enter Skill Name"
            onChange={(e) => {
              setSearchFilter(e.target.value);
              console.log(e.target.value);
            }}
          ></input>
        </div>
        <div className="relative flex flex-col gap-2 justify-around py-4 flex-1 bg-black/70 ">
          <div
            ref={listDivRef}
            className="flex flex-[0px] flex-col px-4 overflow-auto mask-alpha mask-t-from-99% mask-t-from-[#D6C9AD] mask-t-to-transparent mask-b-from-98% mask-b-from-[#D6C9AD] mask-b-to-transparent"
          >
            <SkillList
              allSkills={allSkills}
              searchFilter={searchFilter}
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
            ></SkillList>
          </div>
          <div className="px-4">
            <h4 className="w-full text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
              Filters
            </h4>
            <div
              className={`flex flex-col gap-2 items-start px-2 py-4 text-lg rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a85f39] focus:outline-none focus:ring-0`}
            >
              <div className="flex w-full gap-1">
                <h4 className="font-inter text-base text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Type:
                </h4>
                <div className="flex-1 flex gap-1 h-full font-inter text-sm">
                  <button
                    onClick={() => {
                      setTypeFilter((prev) => {
                        if (!prev[1] && prev[2]) {
                          return { ...prev, 1: !prev[1], 3: true };
                        } else {
                          return { ...prev, 1: !prev[1], 3: false };
                        }
                      });
                    }}
                    className={`flex-1 text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
                      typeFilter[1]
                        ? "bg-[#D6C9AD] border-[#a86f39]"
                        : "bg-[#867E6B] border-[#86592E]"
                    }`}
                  >
                    Blademaster
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter((prev) => {
                        if (!prev[2] && prev[1]) {
                          return { ...prev, 2: !prev[2], 3: true };
                        } else {
                          return { ...prev, 2: !prev[2], 3: false };
                        }
                      });
                    }}
                    className={`flex-1 text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
                      typeFilter[2]
                        ? "bg-[#D6C9AD] border-[#a86f39]"
                        : "bg-[#867E6B] border-[#86592E]"
                    }`}
                  >
                    Gunner
                  </button>
                </div>
              </div>
              <div className="flex w-full gap-1">
                <h4 className="font-inter text-base text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Rarity:
                </h4>
                <div className="flex-1 w-full grid grid-cols-6 gap-0.5">
                  {Array.from({ length: 11 }, (_, i) => (
                    <button
                      key={`rank_${i + 1}`}
                      onClick={() => {
                        setRankFilter(i + 1);
                      }}
                      className={`flex justify-center w-full text-center items-center text-sm rounded-lg border-2 cursor-pointer transition-all duration-800 ease-out ${
                        i + 1 <= rankFilter
                          ? "bg-[#D6C9AD] border-[#a86f39]"
                          : "bg-[#867E6B] border-[#86592E]"
                      }`}
                    >
                      {i + 1}
                      <FontAwesomeIcon
                        className="h-0.5 w-0.5 text-amber-600"
                        icon={faStar}
                      ></FontAwesomeIcon>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center w-full mt-2">
                <button
                  onClick={async () => {
                    const armorsByRarity = (await getByRarity(
                      rankFilter,
                    )) as ArmorItem[];

                    const type = [3, 1, 2].find((i) => typeFilter[i]);
                    if (!type) return console.log("Undefined");
                    console.log("TYPE FILTER IS", typeFilter);
                    console.log("TYPE IS:", type);

                    const groupedByPieceAndType = groupByArmorPieceAndType(
                      armorsByRarity,
                      type,
                    );

                    const retrievedMaxSkills = maxSkillPossible(
                      groupedByPieceAndType!,
                    );

                    console.log(
                      "THESE ARE THE SELECTED SKILLS:",
                      selectedSkills,
                    );

                    const requiredSkills = Object.entries(
                      selectedSkills,
                    ).reduce((acc, [skillTree, value]) => {
                      acc[skillTree] = value.level;
                      return acc;
                    }, {} as SkillMap);

                    console.log("REQUIRED SKILLS ARE:", requiredSkills);

                    const filteredArmors = getFilteredArmors(
                      retrievedMaxSkills,
                      groupedByPieceAndType!,
                      requiredSkills,
                    );

                    console.log(
                      "THESE ARE THE FILTERED ARMORS:",
                      filteredArmors,
                    );
                    setArmorResults(filteredArmors);
                  }}
                  className="cursor-pointer bg-[#B8894E] rounded-2xl border border-[#8A5A2B] p-2 hover:bg-[#C79A5C] transition-color duration-300 ease-out"
                >
                  <h4 className="font-inter text-base text-[#2B1E12]">
                    Search Armor Sets
                  </h4>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-2.5">
        <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
          Armor Sets
        </h4>
        <div className="flex flex-col flex-1  bg-black/70">
          <div className="flex-[0px] flex flex-col gap-2 overflow-y-auto p-4 mask-alpha mask-t-from-99% mask-t-from-black mask-t-to-transparent mask-b-from-98% mask-b-from-black mask-b-to-transparent">
            {armorsToDisplay.map((armorSets, i) => {
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
                  console.log(
                    "ARMOR",
                    armor.armor,
                    "HAS FIRE RES OF:",
                    armor.elemRes.fire,
                  );
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
                  className="flex flex-col w-full gap-4 rounded-2xl p-4 bg-[#D6C9AD] hover:bg-[#C8BA9D] transition-all duration-300 ease-out cursor-pointer text-xs"
                >
                  <div className="flex flex-col gap-1">
                    {armorSets.map((armor) => (
                      <div className="flex w-full gap-4">
                        <img
                          className="h-6 w-6"
                          src={`/assets/images/${armor.armorPiece}_${armor.rarity}.webp`}
                        ></img>
                        <p className="font-semibold">{armor.armor}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-start flex-1 gap-1">
                    <div className="flex">
                      <p>
                        Defense: {defense.min} - {defense.max}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {Object.entries(armorSets[0].elemRes).map((elem) => {
                        console.log("ELEM", elem, "RES", elem);
                        return (
                          <div className="flex items-center">
                            <img
                              className="h-4 w-4"
                              src={`/assets/images/${elem[0]}.webp`}
                            ></img>
                            <p>: {elemRes[elem[0] as keyof typeof elemRes]}</p>
                          </div>
                        );
                      })}
                    </div>
                    <p>
                      Slots:{" "}
                      {slots.map((slot, i) => (
                        <>
                          {i == slots.length - 1 ? (
                            <span>
                              {"O".repeat(slot) + "-".repeat(3 - slot)}
                            </span>
                          ) : (
                            <span>
                              {"O".repeat(slot) + "-".repeat(3 - slot)},{" "}
                            </span>
                          )}
                        </>
                      ))}{" "}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-4">
        <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
          Set Details
        </h4>
        <div className="flex-1 flex flex-col gap-6 font-inter bg-black/70 p-2">
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
                  <img
                    className="h-4 w-4"
                    src="/assets/images/water.webp"
                  ></img>
                  <p>
                    :
                    {Object.values(selectedArmor).reduce(
                      (acc, armor) => acc + (armor?.elemRes.water ?? 0),
                      0,
                    )}
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    className="h-4 w-4"
                    src="/assets/images/thunder.webp"
                  ></img>
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
                  <img
                    className="h-4 w-4"
                    src="/assets/images/dragon.webp"
                  ></img>
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
          <div className="flex flex-col flex-3">
            <div className="flex flex-col flex-1">
              {/* [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] */}
              <h4 className="w-full text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
                Skill Details
              </h4>
              <div
                className={`flex flex-col items-start text-base flex-[0px] overflow-auto p-2 rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a86f39] focus:outline-none focus:ring-0`}
              >
                <table className="w-full text-center table-auto">
                  <thead className="bg-[#3A2623] text-gray-200 [&_th]:border-2 [&_th]:border-black [&_th]:p-1 ">
                    <tr>
                      <th className="">Skill Tree</th>
                      <th>Head</th>
                      <th>Torso</th>
                      <th>Arms</th>
                      <th>Waist</th>
                      <th>Legs</th>
                      <th>Sum</th>
                      <th>Active Skills</th>
                    </tr>
                  </thead>
                  <tbody className="[&_td]:p-1">
                    {[
                      ...skillRows,
                      ...(skillRows.length == 10
                        ? Array(2).fill(Array(8).fill(""))
                        : (Array(10 - skillRows.length).fill(
                            Array(8).fill(""),
                          ) as (string | number)[][])),
                    ].map((rows, i) => (
                      <tr
                        className={`h-8
                                    ${
                                      i % 2 === 0
                                        ? "bg-[#B0A37A]"
                                        : "bg-[#C2B494]"
                                    }`}
                        key={`row_${i}`}
                      >
                        {rows.map((column: string, j: number) => (
                          <td
                            className={`border-2   ${
                              activatedCount == i + 1 &&
                              activatedCount != 0 &&
                              skillRows.length > 1 &&
                              j != 0
                                ? " border-b-amber-300 border-t-black border-l-black border-r-black"
                                : "border-black"
                            }`}
                            key={`column_${i}+${j}`}
                          >
                            {column}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetBuilder;
