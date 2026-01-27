import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { RankFilterType, PieceFilterType, PieceType } from "../types";
import type { Dispatch, SetStateAction } from "react";
import { useAppContext } from "./Hooks/UseAppContext";
const ArmorBuilderFilter = ({
  typeFilter,
  setTypeFilter,
  orderFilter,
  setOrderFilter,
  pieceFilters,
  setPieceFilters,
  rankFilter,
  setRankFilter,
  setSearchFilter,
  showFilter,
  setShowFilter,
}: {
  typeFilter: Record<string, boolean>;
  setTypeFilter: Dispatch<SetStateAction<Record<string, boolean>>>;
  orderFilter: boolean;
  setOrderFilter: Dispatch<SetStateAction<boolean>>;
  pieceFilters: PieceFilterType;
  setPieceFilters: Dispatch<SetStateAction<PieceFilterType>>;
  rankFilter: RankFilterType;
  setRankFilter: Dispatch<SetStateAction<RankFilterType>>;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setShowBackground } = useAppContext();
  return (
    <div
      className={` fixed  ${showFilter ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} border border-[#D2AA5A]/60 rounded-t-xl lg:opacity-100 lg:pointer-events-auto lg:border-0 transition-opacity duration-200 ease-out z-40 inset-x-1 top-1/2 -translate-y-1/2 lg:top-0 lg:translate-y-0 lg:m-0 lg:z-0 lg:relative lg:flex-2 flex flex-col `}
    >
      <h4 className="flex justify-between items-center lg:block font-inter text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
        Filters
        <button
          onClick={() => {
            setShowFilter(false);
            setShowBackground(false);
          }}
          className="lg:hidden cursor-pointer"
        >
          <FontAwesomeIcon
            className=" text-red-600"
            icon={faXmark}
          ></FontAwesomeIcon>
        </button>
      </h4>
      <div className="flex flex-col justify-around gap-4 lg:gap-0 flex-1 bg-black/70 px-1 lg:px-4 py-4 lg:py-0">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
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

        <div className="flex gap-2 ">
          <h4 className=" font-inter   text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
            Armor Piece:
          </h4>
          <div className="flex-1 flex gap-1 h-full font-inter text-sm">
            {(Object.keys(pieceFilters) as (keyof PieceType)[]).map((piece) => (
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
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
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
                className={`flex-1 flex justify-center cursor-pointer text-center items-center  rounded-lg border-2   transition-all duration-800 ease-out ${
                  rankFilter[(i + 1) as keyof typeof rankFilter]
                    ? "bg-[#D6C9AD] border-[#a86f39]"
                    : "bg-[#867E6B] border-[#86592E]"
                }`}
              >
                {i + 1}
                <FontAwesomeIcon
                  className="text-xs lg:text-sm text-amber-600"
                  icon={faStar}
                ></FontAwesomeIcon>
              </button>
            ))}
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
  );
};

export default ArmorBuilderFilter;
