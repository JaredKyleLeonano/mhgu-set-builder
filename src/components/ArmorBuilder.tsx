import { useState, useMemo, useRef } from "react";
import ArmorList from "./ArmorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGear } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "./Hooks/UseAppContext";
import type { PieceType, ArmorItem } from "../types";
import SkillTable from "./SkillTable";
import OverallStats from "./OverallStats";
import ArmorBuilderFilter from "./ArmorBuilderFilter";

const ArmorBuilder = () => {
  const { allArmors } = useAppContext();

  const [showFilter, setShowFilter] = useState(false);

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
    <div className="flex flex-col lg:flex-row h-full w-full justify-between gap-1 lg:gap-4">
      <div
        className={`${showFilter ? "opacity-100 z-30" : "opacity-0 -z-10"} transition-opacity duration-200 ease-out fixed inset-0 h-screen w-screen bg-black/80 lg:hidden`}
      ></div>
      <div className="flex flex-col flex-9 lg:flex-4 gap-4">
        <ArmorBuilderFilter
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          orderFilter={orderFilter}
          setOrderFilter={setOrderFilter}
          pieceFilters={pieceFilters}
          setPieceFilters={setPieceFilters}
          rankFilter={rankFilter}
          setRankFilter={setRankFilter}
          setSearchFilter={setSearchFilter}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        ></ArmorBuilderFilter>
        <div className="flex h-full flex-col flex-4">
          <div className="flex justify-between font-inter text-sm lg:text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
            <h4>Armor List</h4>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden cursor-pointer"
            >
              Filters{" "}
              <FontAwesomeIcon size="sm" icon={faGear}></FontAwesomeIcon>
            </button>
          </div>
          <div className="flex flex-col h-full py-1.5 bg-black/70">
            <div
              ref={listDivRef}
              className="flex-[0px] flex flex-col gap-2 overflow-y-auto pl-2 pr-2 lg:pr-4 mask-alpha mask-t-from-99% mask-t-from-black mask-t-to-transparent mask-b-from-98% mask-b-from-black mask-b-to-transparent"
            >
              <ArmorList parentRef={listDivRef} armors={viewArmors}></ArmorList>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-4 lg:flex-4 gap-4 ">
        <div className="flex-3 flex flex-col ">
          <h4 className=" font-inter text-sm lg:text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
            Set Details
          </h4>
          <div className="flex-1 flex flex-row lg:flex-col gap-2 lg:gap-6 font-inter bg-black/70 p-1 lg:p-2">
            <OverallStats></OverallStats>
            <SkillTable></SkillTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmorBuilder;
