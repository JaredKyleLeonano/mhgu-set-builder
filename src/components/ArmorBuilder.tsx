import { useState, useMemo, useRef } from "react";
import ArmorList from "./ArmorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "./Hooks/UseAppContext";
import type { PieceType, ArmorItem } from "../types";
import SkillTable from "./SkillTable";
import OverallStats from "./OverallStats";

const ArmorBuilder = () => {
  const { allArmors } = useAppContext();

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

  const [rankFilter, setRankFilter] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    11: false,
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
          rankFilter[armor.rarity as keyof typeof rankFilter] &&
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
                      setRankFilter((prev) => ({
                        ...prev,
                        [i + 1]: !prev[(i + 1) as keyof typeof prev],
                      }));
                    }}
                    className={`flex-1 cursor-pointer text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                      rankFilter[(i + 1) as keyof typeof rankFilter]
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
              <ArmorList parentRef={listDivRef} armors={viewArmors}></ArmorList>
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
            <OverallStats></OverallStats>
            <SkillTable></SkillTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmorBuilder;
