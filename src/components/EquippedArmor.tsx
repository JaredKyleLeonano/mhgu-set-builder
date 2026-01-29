import { useAppContext } from "./Hooks/UseAppContext";
import type { PieceType } from "../types";
import EquippedPiece from "./EquippedPiece";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faXmark } from "@fortawesome/free-solid-svg-icons";

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
      className={`${viewEquipment ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} lg:opacity-100 lg:pointer-events-auto transition-opacity duration-400 ease-out border border-[#D2AA5A]/60 lg:border-0 rounded-t-2xl fixed top-1/2 -translate-y-1/2 inset-x-1 lg:top-0 lg:translate-y-0 z-40 lg:z-10 lg:relative flex-3 lg:flex`}
    >
      <div className="flex flex-col w-full overflow-auto rounded-t-2xl lg:border border-black">
        <div className="flex items-end justify-between w-full p-2 lg:p-4 bg-[#6a3237] border-b border-black">
          <h2 className="text-[#d4a553] text-2xl font-inter">Equipment</h2>
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
              <p className="text-[#D6C9AD] group-hover:text-[#FFFBEB] text-xl font-inter transition-colors duration-300 ease-out">
                Reset
              </p>
              <FontAwesomeIcon
                className=" text-[#D6C9AD] group-hover:text-[#FFD700] transition-colors duration-300 ease-out"
                icon={faBroom}
              ></FontAwesomeIcon>
            </button>
            <button
              className="lg:hidden self-center"
              onClick={() => {
                setViewEquipment(false);
                setShowBackground(false);
              }}
            >
              <FontAwesomeIcon
                className=" text-red-600"
                icon={faXmark}
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
        <div className="h-full bg-[#461919E6]">
          <div className="flex flex-col h-full p-2 justify-between gap-2 lg:gap-0">
            {(Object.keys(selectedArmor) as (keyof PieceType)[]).map(
              (piece) => (
                <div
                  key={`equipArmor_${piece}`}
                  className="flex w-full h-26 lg:h-36 bg-black/40 p-3"
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
    </div>
  );
};

export default EquippedArmor;
