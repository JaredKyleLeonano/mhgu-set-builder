import { useAppContext } from "./Hooks/UseAppContext";
import type { PieceType } from "../types";
import EquippedPiece from "./EquippedPiece";

const EquippedArmor = () => {
  const { selectedArmor, setSelectedArmor, setAccumulatedSkills } =
    useAppContext();
  return (
    <div className="flex flex-col w-full overflow-auto rounded-t-2xl border border-black">
      <div className="flex items-center w-full p-4 bg-[#6a3237] border-b border-black">
        <h2 className="text-[#d4a553] text-2xl font-inter">Equipment</h2>
      </div>
      <div className="h-full bg-[#461919E6]">
        <div className="flex flex-col h-full p-2 justify-between">
          {(Object.keys(selectedArmor) as (keyof PieceType)[]).map((piece) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquippedArmor;
