import { useAppContext } from "./Hooks/UseAppContext";
import type { PieceType } from "../types";
import EquippedPiece from "./EquippedPiece";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const EquippedArmor = () => {
  const {
    selectedArmor,
    setSelectedArmor,
    setAccumulatedSkills,
    viewEquipment,
    setViewEquipment,
    setShowBackground,
  } = useAppContext();
  return (
    <div
      className={`${viewEquipment ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} md:w-124 lg:w-156 md:left-1/2 md:-translate-x-1/2 2xl:lef-0 2xl:translate-x-0 2xl:opacity-100 2xl:pointer-events-auto transition-opacity duration-400 ease-out border border-[#D2AA5A]/60 2xl:border-0 rounded-t-2xl fixed top-1/2 -translate-y-1/2 inset-x-1  2xl:inset-x-auto 2xl:top-0 2xl:translate-y-0 z-40 2xl:z-10 2xl:relative flex-3 2xl:flex`}
    >
      <div className="flex flex-col w-full overflow-auto rounded-t-2xl 2xl:border border-black">
        <div className="flex items-end justify-between w-full p-2 lg:px-4 xl:p-4 bg-[#6a3237] border-b border-black">
          <h2 className="text-[#d4a553] text-2xl lg:text-xl xl:text-2xl font-inter">
            Equipment
          </h2>
          <div className="flex gap-7">
            <button
              className="group flex items-center gap-1 cursor-pointer"
              onClick={() => {
                setSelectedArmor(() => ({
                  Head: null,
                  Torso: null,
                  Arms: null,
                  Waist: null,
                  Legs: null,
                }));
                setAccumulatedSkills(() => ({
                  Head: null,
                  Torso: null,
                  Arms: null,
                  Waist: null,
                  Legs: null,
                }));
              }}
            >
              <p className="text-[#D6C9AD] group-hover:text-[#FFFBEB] text-xl lg:text-lg xl:text-xl font-inter transition-colors duration-300 ease-out">
                Reset
              </p>
              <FontAwesomeIcon
                className=" text-[#D6C9AD] group-hover:text-[#FFD700] transition-colors duration-300 ease-out"
                icon={faBroom}
              ></FontAwesomeIcon>
            </button>
            <button
              className="2xl:hidden self-center"
              onClick={() => {
                setViewEquipment(false);
                setShowBackground(false);
              }}
            >
              <FontAwesomeIcon
                className="text-[#9FB3C8] hover:text-[#CFE6C9] self-center  md:text-lg"
                icon={faRightFromBracket}
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
        <div className="h-full bg-[#461919E6]">
          <div className="flex flex-col h-full p-2 justify-between gap-2 2xl:gap-0">
            {(Object.keys(selectedArmor) as (keyof PieceType)[]).map(
              (piece) => (
                <div
                  key={`equipArmor_${piece}`}
                  className="flex w-full h-26 md:h-36 lg:h-30 xl:h-36 bg-black/40 p-3"
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
                      <p className="text-base lg:text-sm xl:text-lg 2xl:text-base">
                        Select Piece from Armor List to Equip
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquippedArmor;
