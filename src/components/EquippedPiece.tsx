import type { ArmorItem, SkillType } from "../queries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { Dispatch, SetStateAction } from "react";

const typeMap: Record<number, string> = {
  1: "Blademaster",
  2: "Gunner",
  3: "Both",
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

const EquippedPiece = (
  armor: ArmorItem,
  setSelectedArmor: Dispatch<SetStateAction<PieceType>>,
  setAccumulatedSkills: Dispatch<SetStateAction<AccumulatedSkillsType>>,
) => {
  return (
    <div className="flex justify-between flex-col h-full w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <img
            key={`${armor.armorPiece}_${armor.rarity}`}
            className="h-6 w-6"
            src={`/assets/images/${armor.armorPiece}_${armor.rarity}.webp`}
          ></img>
          <p className="font-bold text-lg">{armor.armor}</p>
        </div>
        <button
          onClick={() => {
            setSelectedArmor((prev) => ({
              ...prev,
              [armor.armorPiece]: null,
            }));
            setAccumulatedSkills((prev) => ({
              ...prev,
              [armor.armorPiece]: null,
            }));
          }}
          className="cursor-pointer"
        >
          <FontAwesomeIcon
            className=" text-red-600"
            icon={faXmark}
          ></FontAwesomeIcon>
        </button>
      </div>
      <div>
        <div className="flex gap-6">
          <p>Rarity: {armor.rarity}</p>
          <p>Type: {typeMap[armor.type]}</p>
          <p>Slots: {"O".repeat(armor.slots) + "-".repeat(3 - armor.slots)}</p>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-4">
            <p>
              Def: {armor.defense.min}-{armor.defense.max}
            </p>
            <div className="flex gap-1">
              {Object.entries(armor.elemRes).map((elem) => {
                console.log("ELEM", elem, "RES", elem);
                return (
                  <div className="flex items-center">
                    <img
                      className="h-5 w-5"
                      src={`/assets/images/${elem[0]}.webp`}
                    ></img>
                    <p>: {elem[1]}</p>
                  </div>
                );
              })}
              {/* <div className="flex items-center">
                <img className="h-5 w-5" src="/assets/images/fire.webp"></img>
                <p>: {armor.elemRes.fire}</p>
              </div>
              <div className="flex items-center">
                <img className="h-5 w-5" src="/assets/images/water.webp"></img>
                <p>: {armor.elemRes.water}</p>
              </div>
              <div className="flex items-center">
                <img
                  className="h-5 w-5"
                  src="/assets/images/thunder.webp"
                ></img>
                <p>: {armor.elemRes.thunder}</p>
              </div>
              <div className="flex items-center">
                <img className="h-5 w-5" src="/assets/images/ice.webp"></img>
                <p>: {armor.elemRes.ice}</p>
              </div>
              <div className="flex items-center">
                <img className="h-5 w-5" src="/assets/images/dragon.webp"></img>
                <p>: {armor.elemRes.dragon}</p>
              </div> */}
            </div>
          </div>
          <div className="flex gap-1 items-baseline">
            <span>Skills: </span>
            <div className="flex flex-wrap gap-0.5 leading-none">
              {armor.skills.map((skill: SkillType, n) => (
                <span key={n}>
                  [{skill.name}: {skill.level}]
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquippedPiece;
