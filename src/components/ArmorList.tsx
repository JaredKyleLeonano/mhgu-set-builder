import type { ArmorItem, SkillType } from "../queries.ts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, type RefObject } from "react";
import type { SetStateAction, Dispatch } from "react";

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

const ArmorRow = memo(
  ({
    armor,
    setSelectedArmor,
    setAccumulatedSkills,
  }: {
    armor: ArmorItem;
    setSelectedArmor: Dispatch<SetStateAction<PieceType>>;
    setAccumulatedSkills: Dispatch<SetStateAction<AccumulatedSkillsType>>;
  }) => (
    <button
      onClick={() => {
        setSelectedArmor((prev) => ({ ...prev, [armor.armorPiece]: armor }));
        setAccumulatedSkills((prev) => ({
          ...prev,
          [armor.armorPiece]: armor.skills,
        }));
      }}
      className="flex w-full justify-between items-center rounded-2xl bg-[#D6C9AD] hover:bg-[#C8BA9D] hover:shadow-sm transition-all duration-300 ease-out cursor-pointer py-1 px-2 text-xs"
    >
      <div className="flex flex-3 items-center gap-4">
        <img
          key={`${armor.armorPiece}_${armor.rarity}`}
          className="w-8 h-8"
          src={`/assets/images/${armor.armorPiece}_${armor.rarity}.webp`}
          loading="eager"
          decoding="async"
        ></img>
        <div className="flex flex-col">
          <p className="">{armor.armor}</p>
          <div className="flex gap-2">
            <p className="">Rarity: {armor.rarity}</p>
            <p className="">Type: {typeMap[armor.type]}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-5">
        <div className="flex gap-4">
          <p>
            Def: {armor.defense.min}-{armor.defense.max}
          </p>
          <div className="flex gap-1">
            <div className="flex">
              <img className="h-4 w-4" src="/assets/images/fire.webp"></img>
              <p>: {armor.elemRes.fire}</p>
            </div>
            <div className="flex">
              <img className="h-4 w-4" src="/assets/images/water.webp"></img>
              <p>: {armor.elemRes.water}</p>
            </div>
            <div className="flex">
              <img className="h-4 w-4" src="/assets/images/thunder.webp"></img>
              <p>: {armor.elemRes.thunder}</p>
            </div>
            <div className="flex">
              <img className="h-4 w-4" src="/assets/images/ice.webp"></img>
              <p>: {armor.elemRes.ice}</p>
            </div>
            <div className="flex">
              <img className="h-4 w-4" src="/assets/images/dragon.webp"></img>
              <p>: {armor.elemRes.dragon}</p>
            </div>
          </div>
          <p>Slots: {"O".repeat(armor.slots) + "-".repeat(3 - armor.slots)}</p>
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
    </button>
  ),
);

const ArmorList = ({
  armors,
  parentRef,
  setSelectedArmor,
  setAccumulatedSkills,
}: {
  armors: ArmorItem[];
  parentRef: RefObject<HTMLDivElement | null>;
  setSelectedArmor: Dispatch<SetStateAction<PieceType>>;
  setAccumulatedSkills: Dispatch<SetStateAction<AccumulatedSkillsType>>;
}) => {
  const rowVirtualizer = useVirtualizer({
    count: armors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 51,
    measureElement: (element) => element.getBoundingClientRect().height,
    overscan: 10,
  });

  return (
    <>
      <div
        className={`relative`}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const armor = armors[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              className={`absolute top-0 left-0 w-full`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="mb-2">
                <ArmorRow
                  armor={armor}
                  setSelectedArmor={setSelectedArmor}
                  setAccumulatedSkills={setAccumulatedSkills}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ArmorList;
