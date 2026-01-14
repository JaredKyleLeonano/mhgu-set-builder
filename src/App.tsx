import { useState, useEffect, useMemo } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  getByRarity,
  groupByArmorPiece,
  maxSkillPossible,
  getFilteredArmors,
} from "./queries.ts";
import type { ArmorItem, SkillMap } from "./queries.ts";
import skillTree from "../scripts/output/skillTree.json";
// import database from "./db/database.ts";
import armorList from "./components/ArmorList.tsx";
import ArmorList from "./components/ArmorList.tsx";
import { useRef } from "react";

function App() {
  const listDivRef = useRef<HTMLDivElement>(null);

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

  const [orderFilter, setOrderFilter] = useState(true);
  const [listHeight, setListHeight] = useState(0);
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
      console.log("Armors:", armors);
      setAllArmors(armors);
    })();

    if (listDivRef.current) {
      const rect = listDivRef.current.getBoundingClientRect();
      setListHeight(rect.height);
    }
  }, []);

  const armorSortMap = useMemo(
    () => ({
      Head: 0,
      Torso: 1,
      Arms: 2,
      Waist: 3,
      Legs: 4,
    }),
    []
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
    return allArmors
      .filter(
        (armor) => pieceFilters[armor.armorPiece] && typeFilter[armor.type]
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
  ]);

  // database();
  return (
    <div className="flex flex-col gap-4 h-screen w-screen bg-[#222222]">
      <div className="h-full w-full flex justify-center items-center absolute">
        <img
          src={"/assets/images/Hunter's_Guild_Crest.svg"}
          className="h-124 w-124 opacity-60"
        />
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
        <div className="flex flex-col flex-1/4 overflow-auto rounded-t-2xl border border-black">
          <div className="flex items-center w-full p-4 bg-[#6a3237] border-b border-black">
            <h2 className="text-[#d4a553] text-2xl">Equipment</h2>
          </div>
          <div className="h-full bg-[#46191966]">
            <ul className="flex flex-col h-full p-2 justify-between gap-2">
              <li className="w-full h-1/5 bg-black/40 "></li>
              <li className="w-full h-1/5 bg-black/40 "></li>
              <li className="w-full h-1/5 bg-black/40 "></li>
              <li className="w-full h-1/5 bg-black/40 "></li>
              <li className="w-full h-1/5 bg-black/40 "></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col flex-3/4">
          <div className="flex justify-between items-center h-18 bg-gray-300 rounded-t-2xl">
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
          <div className="flex bg-[#cd9f5b66] h-full p-4 gap-4 ">
            <div className="flex-4 flex flex-col gap-4">
              <div className="flex-2 flex flex-col">
                <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Filters
                </h4>
                <div className="flex flex-col gap-4 flex-1 bg-black/70 px-4 py-2">
                  <div className="flex gap-2">
                    <h4 className=" font-inter   text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                      Rarity:
                    </h4>
                    <div className="flex-1 flex gap-1 h-full font-inter text-sm">
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Torso: !prev.Torso,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Torso
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Low-Rank
                      </button>
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Torso: !prev.Torso,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Torso
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        High Rank
                      </button>
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Torso: !prev.Torso,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Torso
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
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Head: !prev.Head,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Head
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Head
                      </button>
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Torso: !prev.Torso,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Torso
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Torso
                      </button>
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Arms: !prev.Arms,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Arms
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Arms
                      </button>
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Waist: !prev.Waist,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                          pieceFilters.Waist
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Waist
                      </button>
                      <button
                        onClick={() => {
                          setPieceFilters((prev) => ({
                            ...prev,
                            Legs: !prev.Legs,
                          }));
                        }}
                        className={`flex-1 text-center items-center  rounded-lg border-2 transition-all duration-800 ease-out ${
                          pieceFilters.Legs
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Legs
                      </button>
                    </div>
                  </div>
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
                </div>
              </div>
              <div className="flex h-full flex-col flex-4">
                <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Armor List
                </h4>
                <div
                  ref={listDivRef}
                  className="flex-[0px] flex flex-col gap-2 overflow-y-auto bg-black/70 py-2 pl-2 pr-4"
                >
                  <ArmorList
                    parentRef={listDivRef}
                    armors={viewArmors}
                  ></ArmorList>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-4 gap-4 ">
              {/* <div className="flex-2 flex flex-col">
                <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Piece Details
                </h4>
                <div className="flex-1 bg-black/70"></div>
              </div> */}
              <div className="flex-3 flex flex-col ">
                <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                  Set Details
                </h4>
                <div className="flex-1 bg-black/70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
