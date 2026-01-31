import {
  getByRarity,
  groupByArmorPieceAndType,
  maxSkillPossible,
  getFilteredArmors,
} from "../queries";
import type { ArmorItem, SkillType, SkillMap } from "../types";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SkillList from "./SkillList";
import { useAppContext } from "./Hooks/UseAppContext";
import SetList from "./SetList";
import ArmorDetails from "./ArmorDetails";

const SetBuilder = () => {
  const { allSkills } = useAppContext();

  const horizontalScrollDiv = useRef<HTMLDivElement | null>(null);
  const autoScroll = () => {
    horizontalScrollDiv.current?.scrollBy({
      left: window.innerHeight / 2,
      behavior: "smooth",
    });
  };

  const [searchFilter, setSearchFilter] = useState("");

  const [typeFilter, setTypeFilter] = useState(true);

  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, SkillType>
  >({});
  const [rankFilter, setRankFilter] = useState(11);

  const [armorResults, setArmorResults] = useState<ArmorItem[][]>([]);
  const [searchResult, setSearchResult] = useState<string>("No Search Yet");

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-1 lg:gap-4 ">
      <div
        ref={horizontalScrollDiv}
        className="flex flex-9 lg:flex-5 lg:gap-4 overflow-x-auto lg:overflow-x-visible min-w-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        <div className="px-1 pt-1 lg:p-0 h-full w-full flex-none lg:flex-2 snap-start">
          <div className="flex flex-col h-full w-full ">
            <div className="flex rounded-t-xl bg-[#3A2623] px-2 py-1">
              <div className="flex-1 whitespace-nowrap font-inter text-sm md:text-2xl lg:text-xl xl:text-2xl text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                <h4>Skill List</h4>
              </div>
              <input
                className={`w-[60%] font-inter px-2 text-sm rounded-lg border-2 bg-[#D6C9AD] border-[#a86f39] focus:outline-none focus:ring-0`}
                placeholder="Enter Skill Name"
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  console.log(e.target.value);
                }}
              ></input>
            </div>
            <div className="relative w-full flex flex-col gap-1 lg:gap-2 justify-around flex-1 min-w-0 min-h-0 py-1 lg:py-2 bg-black/70 ">
              <div className="flex-3 h-full w-full p-1 lg:px-4 overflow-y-auto mask-alpha mask-t-from-99% mask-t-from-[#D6C9AD] mask-t-to-transparent mask-b-from-98% mask-b-from-[#D6C9AD] mask-b-to-transparent">
                <SkillList
                  allSkills={allSkills}
                  searchFilter={searchFilter}
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                ></SkillList>
              </div>
              <div className="flex flex-1 flex-col lg:flex-0 px-1 lg:px-4 font-inter">
                <h4 className="w-full text-sm md:text-xl lg:text-lg xl:text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
                  Filters
                </h4>
                <div
                  className={`flex flex-1 gap-2 justify-center items-center lg:flex-col lg:gap-2 lg:items-start  lg:px-2 p-1 lg:py-4 text-lg rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a85f39] focus:outline-none focus:ring-0`}
                >
                  <div className="flex flex-1 items-center lg:items-start flex-col lg:flex-row w-full gap-1">
                    <h4 className="font-inter text-xs md:text-base lg:text-base text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                      Type:
                    </h4>
                    <div className="flex-1 flex flex-col lg:flex-row gap-1 h-full font-inter">
                      <button
                        onClick={() => {
                          setTypeFilter(!typeFilter);
                        }}
                        className={`flex-1 px-1 text-center items-center text-xs md:text-sm lg:text-sm rounded-lg border-2 transition-all duration-800 ease-out ${
                          typeFilter
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Blademaster
                      </button>
                      <button
                        onClick={() => {
                          setTypeFilter(!typeFilter);
                        }}
                        className={`flex-1 px-1 text-center items-center text-xs md:text-sm lg:text-sm rounded-lg border-2 transition-all duration-800 ease-out ${
                          !typeFilter
                            ? "bg-[#D6C9AD] border-[#a86f39]"
                            : "bg-[#867E6B] border-[#86592E]"
                        }`}
                      >
                        Gunner
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-3 flex-col items-center lg:items-start xl:flex-row w-full gap-1">
                    <h4 className="font-inter text-xs md:text-base lg:text-base text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
                      Rarity:
                    </h4>
                    <div className="flex-1 w-full grid grid-cols-6 lg:grid-cols-6 gap-0.5">
                      {Array.from({ length: 11 }, (_, i) => (
                        <button
                          key={`rank_${i + 1}`}
                          onClick={() => {
                            setRankFilter(i + 1);
                          }}
                          className={`flex justify-center w-full text-center items-center text-xs md:text-sm lg:text-sm rounded-lg border-2 cursor-pointer transition-all duration-800 ease-out ${
                            i + 1 <= rankFilter
                              ? "bg-[#D6C9AD] border-[#a86f39]"
                              : "bg-[#867E6B] border-[#86592E]"
                          }`}
                        >
                          {i + 1}
                          <FontAwesomeIcon
                            className="text-xs xl:text-sm text-amber-600"
                            icon={faStar}
                          ></FontAwesomeIcon>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 h-full justify-center items-center w-full lg:mt-2">
                    <div className="lg:hidden invisible text-xs md:text-base lg:text-base pointer-events-none select-none">
                      filler
                    </div>
                    <button
                      onClick={async () => {
                        if (!Object.values(selectedSkills).length) {
                          setArmorResults([]);
                          setSearchResult(
                            "Select wanted Skills first for Armor Sets",
                          );
                          autoScroll();
                          return;
                        }
                        console.log("SELECTED SKILLS ARE:", selectedSkills);
                        const armorsByRarity = (await getByRarity(
                          rankFilter,
                        )) as ArmorItem[];
                        const type = typeFilter ? 1 : 2;
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
                          setArmorResults([]);
                          setSearchResult(
                            "Impossible Skill Combination without Charms or Decorations",
                          );
                        }
                        autoScroll();
                      }}
                      className="cursor-pointer bg-[#B8894E] rounded-2xl border border-[#8A5A2B] md:px-2 lg:p-2 hover:bg-[#C79A5C] transition-color duration-300 ease-out"
                    >
                      <div className="flex flex-col lg:flex-row lg:gap-1 justify-center items-center py-0.5 font-inter leading-snug text-base md:text-xl lg:text-base text-[#2B1E12]">
                        <h4>Search </h4>
                        <FontAwesomeIcon
                          className="text-xs md:text-lg lg:text-base"
                          icon={faMagnifyingGlass}
                        ></FontAwesomeIcon>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-1 pt-1 lg:p-0 w-full h-full flex-none lg:flex-3 xl:flex-2 snap-start">
          <SetList
            armorResults={armorResults}
            searchResult={searchResult}
          ></SetList>
        </div>
      </div>
      <div className="flex flex-col h-full flex-4 lg:flex-3 xl:flex-4   gap-4 mx-1 mb-1 lg:m-0">
        <ArmorDetails></ArmorDetails>
      </div>
    </div>
  );
};

export default SetBuilder;
