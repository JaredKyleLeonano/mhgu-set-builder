import {
  getByRarity,
  groupByArmorPieceAndType,
  maxSkillPossible,
  getFilteredArmors,
} from "../queries";
import type { ArmorItem, SkillType, SkillMap } from "../types";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SkillList from "./SkillList";
import { useAppContext } from "./Hooks/UseAppContext";
import SkillTable from "./SkillTable";
import SetList from "./SetList";
import OverallStats from "./OverallStats";

const SetBuilder = () => {
  const { allSkills } = useAppContext();

  const [searchFilter, setSearchFilter] = useState("");

  const [typeFilter, setTypeFilter] = useState<Record<string, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, SkillType>
  >({});
  const [rankFilter, setRankFilter] = useState(11);

  const listDivRef = useRef<HTMLDivElement>(null);
  const [armorResults, setArmorResults] = useState<ArmorItem[][]>([]);
  const [searchResult, setSearchResult] = useState<string>("No Search Yet");

  return (
    <div className="flex h-full w-full justify-between gap-4 font-inter">
      <div className="flex flex-col flex-2.2">
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

                    const groupedByPieceAndType = groupByArmorPieceAndType(
                      armorsByRarity,
                      type,
                    );

                    const retrievedMaxSkills = maxSkillPossible(
                      groupedByPieceAndType!,
                    );

                    const requiredSkills = Object.entries(
                      selectedSkills,
                    ).reduce((acc, [skillTree, value]) => {
                      acc[skillTree] = value.level;
                      return acc;
                    }, {} as SkillMap);

                    const filteredArmors = getFilteredArmors(
                      retrievedMaxSkills,
                      groupedByPieceAndType!,
                      requiredSkills,
                    );

                    setArmorResults(filteredArmors);
                    if (!Object.values(filteredArmors).length) {
                      setSearchResult(
                        "Impossible Skill Combination without Charms or Decorations",
                      );
                    }
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
      <SetList
        armorResults={armorResults}
        searchResult={searchResult}
      ></SetList>
      <div className="flex flex-col flex-5">
        <h4 className=" font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
          Set Details
        </h4>
        <div className="flex-1 flex flex-col gap-6 font-inter bg-black/70 p-2">
          <OverallStats></OverallStats>
          <SkillTable></SkillTable>
        </div>
      </div>
    </div>
  );
};

export default SetBuilder;
