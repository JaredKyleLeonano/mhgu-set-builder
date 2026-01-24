import { useState, useMemo, useRef, useEffect } from "react";
import type { ArmorItem, SkillType } from "../queries";
import ArmorList from "./ArmorList";
import type { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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

type CompiledSkillsType = Record<string, number[]>;

const ArmorBuilder = ({
  allArmors,
  allSkills,
  selectedArmor,
  setSelectedArmor,
  accumulatedSkills,
  setAccumulatedSkills,
}: {
  allArmors: ArmorItem[];
  allSkills: SkillTreeMap;
  selectedArmor: PieceType;
  setSelectedArmor: Dispatch<SetStateAction<PieceType>>;
  accumulatedSkills: AccumulatedSkillsType;
  setAccumulatedSkills: Dispatch<SetStateAction<AccumulatedSkillsType>>;
}) => {
  const listDivRef = useRef<HTMLDivElement>(null);

  const [typeFilter, setTypeFilter] = useState<Record<string, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const [orderFilter, setOrderFilter] = useState(false);

  const [pieceFilters, setPieceFilters] = useState({
    Head: true,
    Torso: true,
    Arms: true,
    Waist: true,
    Legs: true,
  });

  const [searchFilter, setSearchFilter] = useState("");

  const rankMap: Record<number, string> = useMemo(
    () => ({
      1: "lowRank",
      2: "lowRank",
      3: "lowRank",
      4: "highRank",
      5: "highRank",
      6: "highRank",
      7: "highRank",
      8: "gRank",
      9: "gRank",
      10: "gRank",
      11: "gRank",
    }),
    [],
  );

  const [rankFilter, setRankFilter] = useState(11);

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

  const setOrderMap = useMemo(() => {
    const map = new Map();
    let setCounter = 0;

    for (const armor of allArmors) {
      if (!map.has(armor.set)) {
        map.set(armor.set, setCounter++);
      }
    }
    return map;
  }, [allArmors]);

  const viewArmors = useMemo(() => {
    const searchChecker = (armor: ArmorItem) => {
      return searchFilter
        ? armor.armor.toLowerCase().includes(searchFilter.toLowerCase()) ||
            armor.skills.some((skill) =>
              skill.name.toLowerCase().includes(searchFilter.toLowerCase()),
            )
        : true;
    };
    return allArmors
      .filter(
        (armor) =>
          armor.rarity <= rankFilter &&
          typeFilter[armor.type] &&
          pieceFilters[armor.armorPiece] &&
          searchChecker(armor),
      )
      .sort((a, b) => {
        if (a.set !== b.set) {
          return orderFilter
            ? setOrderMap.get(a.set) - setOrderMap.get(b.set)
            : setOrderMap.get(b.set) - setOrderMap.get(a.set);
        }

        const typeOrder = a.type - b.type;
        if (typeOrder !== 0) return typeOrder;

        return armorSortMap[a.armorPiece] - armorSortMap[b.armorPiece];
      });
  }, [
    allArmors,
    setOrderMap,
    pieceFilters,
    typeFilter,
    armorSortMap,
    orderFilter,
    rankFilter,
    searchFilter,
  ]);

  const [skillRows, activatedCount] = useMemo(() => {
    console.log("ACCUMULATED SKILLS", accumulatedSkills);
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

      console.log("THIS IS SKILL TREE IN LOOP", skillTree);
      console.log("THIS IS LEVELS IN LOOP", levels);
      console.log("THIS IS ALL SKILLS IN LOOP", allSkills);

      let activated = undefined;
      for (const details of allSkills[skillTree].details) {
        console.log("DETAILS ARE:", details);
        console.log("SKILL NAME:", details.name, "SKILL LEVEL:", details.level);
        if (details.level > 0 && levels[5] >= details.level) {
          console.log("THIS RAN INSIDE ACTIVATE LOOP");
          activated = details.name;
          break;
        }
      }
      console.log("ACTIVATED SKILL IS", activated);
      if (activated) {
        rows.unshift([skillTree, ...levels, activated]);
        count++;
      } else {
        rows.push([skillTree, ...levels, activated]);
      }
    }
    console.log("COMPILED SKILLS ARE:", compiledSkills);
    console.log("ROWS ARE:", rows);
    return [rows, count];
  }, [accumulatedSkills, armorSortMap, allSkills]);

  useEffect(() => {
    console.log("TYPE FILTER IS:", typeFilter);
  }, [typeFilter]);

  return (
    <div className="flex h-full w-full justify-between gap-4">
      <div className="flex-4 flex flex-col gap-4">
        <div className="flex-2 flex flex-col">
          <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
            Filters
          </h4>
          <div className="flex flex-col justify-around flex-1 bg-black/70 px-4 py-2">
            <div className="flex gap-2">
              <div className="flex flex-1 gap-2">
                <h4 className="font-inter text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
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
                    className={`flex-1 text-center cursor-pointer items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
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
                    className={`flex-1 text-center cursor-pointer items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
                      typeFilter[2]
                        ? "bg-[#D6C9AD] border-[#a86f39]"
                        : "bg-[#867E6B] border-[#86592E]"
                    }`}
                  >
                    Gunner
                  </button>
                </div>
              </div>
              <div className="flex flex-1 gap-2">
                <h4 className="font-inter text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Order:
                </h4>
                <div className="flex-1 flex gap-1 h-full font-inter text-sm">
                  <button
                    onClick={() => {
                      setOrderFilter(true);
                    }}
                    className={`flex-1 cursor-pointer text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
                      orderFilter
                        ? "bg-[#D6C9AD] border-[#a86f39]"
                        : "bg-[#867E6B] border-[#86592E]"
                    }`}
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => {
                      setOrderFilter(false);
                    }}
                    className={`flex-1 cursor-pointer text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
                      !orderFilter
                        ? "bg-[#D6C9AD] border-[#a86f39]"
                        : "bg-[#867E6B] border-[#86592E]"
                    }`}
                  >
                    Descending
                  </button>
                </div>{" "}
              </div>
            </div>
            <div className="flex gap-2">
              <h4 className=" font-inter   text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                Rarity:
              </h4>
              <div className="flex-1 flex gap-1 h-full font-inter text-sm">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={`rank_${i + 1}`}
                    onClick={() => {
                      setRankFilter(i + 1);
                    }}
                    className={`flex-1 cursor-pointer text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                      i + 1 <= rankFilter
                        ? "bg-[#D6C9AD] border-[#a86f39]"
                        : "bg-[#867E6B] border-[#86592E]"
                    }`}
                  >
                    {i + 1}
                    <FontAwesomeIcon
                      className="h-1 w-1 text-amber-600"
                      icon={faStar}
                    ></FontAwesomeIcon>
                  </button>
                ))}
                {/* <button
                  onClick={() => {
                    setRankFilter((prev) => ({
                      ...prev,
                      lowRank: !prev.lowRank,
                    }));
                  }}
                  className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                    rankFilter.lowRank
                      ? "bg-[#D6C9AD] border-[#a86f39]"
                      : "bg-[#867E6B] border-[#86592E]"
                  }`}
                >
                  Low Rank
                </button>
                <button
                  onClick={() => {
                    setRankFilter((prev) => ({
                      ...prev,
                      highRank: !prev.highRank,
                    }));
                  }}
                  className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                    rankFilter.highRank
                      ? "bg-[#D6C9AD] border-[#a86f39]"
                      : "bg-[#867E6B] border-[#86592E]"
                  }`}
                >
                  High Rank
                </button>
                <button
                  onClick={() => {
                    setRankFilter((prev) => ({
                      ...prev,
                      gRank: !prev.gRank,
                    }));
                  }}
                  className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                    rankFilter.gRank
                      ? "bg-[#D6C9AD] border-[#a86f39]"
                      : "bg-[#867E6B] border-[#86592E]"
                  }`}
                >
                  G-Rank
                </button> */}
              </div>
            </div>
            <div className="flex gap-2 ">
              <h4 className=" font-inter   text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                Armor Piece:
              </h4>
              <div className="flex-1 flex gap-1 h-full font-inter text-sm">
                {(Object.keys(pieceFilters) as (keyof PieceType)[]).map(
                  (piece) => (
                    <button
                      key={`pieceFilter_${piece}`}
                      onClick={() => {
                        setPieceFilters((prev) => ({
                          ...prev,
                          [piece]: !prev[piece],
                        }));
                      }}
                      className={`flex-1 cursor-pointer text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                        pieceFilters[piece]
                          ? "bg-[#D6C9AD] border-[#a86f39]"
                          : "bg-[#867E6B] border-[#86592E]"
                      }`}
                    >
                      {piece}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="flex gap-2 font-inter">
              <h4 className="text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                Search:
              </h4>
              <input
                className={`flex-1 px-2 items-center text-sm rounded-lg border-2 transition-all duration-800 ease-out bg-[#D6C9AD] border-[#a86f39] focus:outline-none focus:ring-0`}
                placeholder="Enter Armor Name or Skill"
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  console.log(e.target.value);
                }}
              ></input>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col flex-4">
          <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
            Armor List
          </h4>
          <div className="flex flex-col h-full py-1.5 bg-black/70">
            <div
              ref={listDivRef}
              className="flex-[0px] flex flex-col gap-2 overflow-y-auto pl-2 pr-4 mask-alpha mask-t-from-99% mask-t-from-black mask-t-to-transparent mask-b-from-98% mask-b-from-black mask-b-to-transparent"
            >
              <ArmorList
                parentRef={listDivRef}
                armors={viewArmors}
                setSelectedArmor={setSelectedArmor}
                setAccumulatedSkills={setAccumulatedSkills}
              ></ArmorList>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-4   gap-4 ">
        <div className="flex-3 flex flex-col ">
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
                    <img
                      className="h-4 w-4"
                      src="/assets/images/fire.webp"
                    ></img>
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
                    <img
                      className="h-4 w-4"
                      src="/assets/images/ice.webp"
                    ></img>
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
                          ? "O".repeat(armor.slots) +
                              "-".repeat(3 - armor.slots)
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
                        ...(skillRows.length >= 10
                          ? Array(1).fill(Array(8).fill(""))
                          : (Array(10 - skillRows.length).fill(
                              Array(8).fill(""),
                            ) as (string | number)[][])),
                      ].map((rows, i) => {
                        console.log("ROWS ARE:", rows);
                        return (
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmorBuilder;
