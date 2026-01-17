import { useState, useEffect, useMemo, use } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  getByRarity,
  groupByArmorPiece,
  maxSkillPossible,
  getFilteredArmors,
  getSkills,
} from "./queries.ts";
import type { ArmorItem, SkillMap, SkillType } from "./queries.ts";
// import database from "./db/database.ts";
import ArmorList from "./components/ArmorList.tsx";
import { useRef } from "react";
import EquippedPiece from "./components/EquippedPiece.tsx";
import ArmorBuilder from "./components/ArmorBuilder.tsx";

function App() {
  const listDivRef = useRef<HTMLDivElement>(null);

  const [allSkills, setAllSkills] = useState<SkillTreeMap>({});

  type SkillTreeMap = Record<string, SkillType[]>;

  type SkillTreeType = {
    skillTree: string;
    details: SkillType[];
  };

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

  const [accumulatedSkills, setAccumulatedSkills] =
    useState<AccumulatedSkillsType>({
      Head: null,
      Torso: null,
      Arms: null,
      Waist: null,
      Legs: null,
    });

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
      // console.log("SLICED ARR", levels.slice(0, 5));
      levels[5] = levels.reduce((acc, level) => acc + (level ?? 0), 0);

      let activated = undefined;
      for (const details of allSkills[skillTree]) {
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

  console.log("FINAL SKILLROWS", skillRows);

  const [selectedArmor, setSelectedArmor] = useState<PieceType>({
    Head: null,
    Torso: null,
    Arms: null,
    Waist: null,
    Legs: null,
  });

  const [pieceFilters, setPieceFilters] = useState({
    Head: true,
    Torso: true,
    Arms: true,
    Waist: true,
    Legs: true,
  });

  const [typeFilter, setTypeFilter] = useState<Record<string, boolean>>({
    1: true,
    2: true,
    3: true,
  });

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

  const [rankFilter, setRankFilter] = useState<Record<string, boolean>>({
    lowRank: true,
    highRank: true,
    gRank: true,
  });

  const [searchFilter, setSearchFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState(true);
  const [allArmors, setAllArmors] = useState<ArmorItem[]>([]);
  // const [viewArmors, setViewArmors] = useState<ArmorItem[]>([]);
  const [viewSkills, setViewSkills] = useState<SkillMap[]>([]);
  const [armorBuilderSelected, setArmorBuilderSelected] = useState(true);
  async function fetchArmors() {
    const armors = (await getByRarity(1, 11)) as ArmorItem[];
    console.log("Armors:", armors);
    setAllArmors(armors);
    const grouped = groupByArmorPiece(armors, 1);
    // console.log("AFTER CALL", grouped);
    const maxSkills = maxSkillPossible(grouped);
    setViewSkills(maxSkills);
    console.log("MAX SKILLS", maxSkills);
    getFilteredArmors(maxSkills, grouped, {
      // Sharpness: 10,
      // KO: 2,
      Artillery: 10,
    });
  }

  useEffect(() => {
    (async () => {
      const armors = (await getByRarity(1, 11)) as ArmorItem[];
      // console.log("Armors:", armors);
      setAllArmors(armors);

      const skills = (await getSkills()) as SkillTreeType[];
      // console.log("SKILL TREE", skills[0].skillTree);
      const skillTreeRecord = skills.reduce(
        (acc, entry) => ((acc[entry.skillTree] = [...entry.details]), acc),
        {} as SkillTreeMap,
      );
      // console.log("SKILL", skillTreeRecord);
      setAllSkills(skillTreeRecord);
    })();

    //preload images
    for (let i = 1; i <= 11; i++) {
      console.log(i);
      new Image().src = `assets/images/Head${i}.webp`;
      new Image().src = `assets/images/Torso${i}.webp`;
      new Image().src = `assets/images/Arms${i}.webp`;
      new Image().src = `assets/images/Waist_${i}.webp`;
      new Image().src = `assets/images/Legs${i}.webp`;
    }
  }, []);

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
          rankFilter[rankMap[armor.rarity]] &&
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
    rankMap,
    searchFilter,
  ]);

  // database();
  return (
    <div className="flex flex-col relative gap-4 h-screen w-screen bg-[#222222] overflow-clip">
      <div className="h-full w-full flex justify-center items-center absolute">
        <img
          src={"/assets/images/Hunter's_Guild_Crest.svg"}
          className="h-124 w-124 opacity-100"
        />
      </div>
      <div className="h-full w-full flex justify-center items-center absolute">
        <img src={"/assets/images/bg.webp"} className="opacity-60" />
      </div>
      <div className="flex">
        <h1 className="text-6xl">MHGU Set Builder || Template title</h1>
        <button
          className="cursor-pointer bg-blue-800 z-10"
          onClick={() => {
            console.log("was clicked");
            setArmorBuilderSelected(!armorBuilderSelected);
          }}
        >
          CLICK ME
        </button>
      </div>
      <div className="flex flex-1 m-4 gap-8 z-10">
        <div className="flex flex-col flex-3 overflow-auto rounded-t-2xl border border-black">
          <div className="flex items-center w-full p-4 bg-[#6a3237] border-b border-black">
            <h2 className="text-[#d4a553] text-2xl font-inter">Equipment</h2>
          </div>
          <div className="h-full bg-[#461919E6]">
            <div className="flex flex-col h-full p-2 justify-between">
              {(Object.keys(selectedArmor) as (keyof PieceType)[]).map(
                (piece) => (
                  <div
                    key={`equipArmor_${piece}`}
                    className="flex w-full h-36 bg-black/40 p-3"
                  >
                    <div
                      className={`flex h-full w-full justify-center items-center font-inter text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
                        selectedArmor[piece] ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      {selectedArmor[piece] ? (
                        EquippedPiece(
                          selectedArmor[piece],
                          setSelectedArmor,
                          setAccumulatedSkills,
                        )
                      ) : (
                        <p>Select Piece from Armor List to Equip</p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-7">
          <div className="flex justify-between items-center h-18 bg-gray-300 rounded-t-2xl border border-black">
            <div className="flex gap-3 justify-around h-full">
              <div className="w-8 bg-[#b57131] rounded-tl-2xl"></div>
              <div className="w-4 bg-[#29b4b0]"></div>
              <div className="w-4 bg-[#b57131]"></div>
            </div>
            <div className=" w-72 h-[80%] bg-[#b57131] rounded-3xl p-1">
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
                <h3
                  onClick={() => {
                    setArmorBuilderSelected(true);
                  }}
                  className={`flex-1 text-center  font-bold z-30 font-inter leading-tight transition-all duration-300 text-sm text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
                    armorBuilderSelected
                      ? "opacity-100"
                      : "opacity-40 cursor-pointer"
                  }`}
                >
                  Armor<br></br>Builder
                </h3>
                <h3
                  onClick={() => {
                    setArmorBuilderSelected(false);
                  }}
                  className={`flex-1 text-center  font-bold z-30 font-inter leading-tight transition-all duration-300 text-sm text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
                    armorBuilderSelected
                      ? "opacity-40 cursor-pointer"
                      : "opacity-100"
                  }`}
                >
                  Set<br></br>Builder
                </h3>
              </div>
            </div>
            <div className="flex gap-3 justify-around h-full">
              <div className="w-4 bg-[#b57131]"></div>
              <div className="w-4 bg-[#29b4b0]"></div>
              <div className="w-8 bg-[#b57131] rounded-tr-2xl"></div>
            </div>
          </div>
          <div className="flex bg-[#D4B483B3] border-l border-r border-b border-black h-full p-4 ">
            <ArmorBuilder
              allArmors={allArmors}
              allSkills={allSkills}
              selectedArmor={selectedArmor}
              setSelectedArmor={setSelectedArmor}
            ></ArmorBuilder>
            {/* <div className="flex w-full justify-between gap-4">
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
                                if (prev[1] && !prev[2]) {
                                  return { ...prev, 1: !prev[1], 3: false };
                                } else {
                                  return { ...prev, 1: !prev[1], 3: true };
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
                                if (prev[2] && !prev[1]) {
                                  return { ...prev, 2: !prev[2], 3: false };
                                } else {
                                  return { ...prev, 2: !prev[2], 3: true };
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
                      <div className="flex flex-1 gap-2">
                        <h4 className="font-inter text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                          Order:
                        </h4>
                        <div className="flex-1 flex gap-1 h-full font-inter text-sm">
                          <button
                            onClick={() => {
                              setOrderFilter(true);
                            }}
                            className={`flex-1 text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
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
                            className={`flex-1 text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
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
                        <button
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
                        </button>
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
                                  piece: !prev[piece],
                                }));
                              }}
                              className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
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
                                (acc, armor) =>
                                  acc + (armor?.elemRes.fire ?? 0),
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
                                (acc, armor) =>
                                  acc + (armor?.elemRes.water ?? 0),
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
                                (acc, armor) =>
                                  acc + (armor?.elemRes.thunder ?? 0),
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
                                (acc, armor) =>
                                  acc + (armor?.elemRes.dragon ?? 0),
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
                        <h4 className="w-full text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
                          Skill Details
                        </h4>
                        <div
                          className={`flex flex-col items-start text-base flex-1 p-2 rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a86f39] focus:outline-none focus:ring-0`}
                        >
                          <table className="w-full border-collapse text-center table-auto">
                            <thead className="bg-[#3A2623] text-gray-200 [&_th]:border-2 [&_th]:border-black [&_th]:p-1 ">
                              <th className="">Skill Tree</th>
                              <th>Head</th>
                              <th>Torso</th>
                              <th>Arms</th>
                              <th>Waist</th>
                              <th>Legs</th>
                              <th>Sum</th>
                              <th>Active Skills</th>
                            </thead>
                            <tbody className="[&_td]:p-1">
                              {[
                                ...skillRows,
                                ...(Array(10 - skillRows.length).fill(
                                  Array(8).fill(""),
                                ) as (string | number)[][]),
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
                                  {rows.map((column, j) => (
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
