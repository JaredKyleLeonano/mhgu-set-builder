import type { ArmorItem, SkillMap } from "../queries.ts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, type RefObject } from "react";

const typeMap: Record<number, string> = {
  1: "Blademaster",
  2: "Gunner",
  3: "Both",
};

const ArmorRow = memo(({ armor }: { armor: ArmorItem }) => (
  <div className="flex w-full justify-between items-center rounded-2xl bg-[#D6C9AD] hover:bg-[#C8BA9D] transition-all duration-300 ease-out cursor-pointer py-1 px-2 text-xs">
    <div className="flex flex-6 items-center gap-4">
      <img
        className="w-8 h-8"
        src={`/assets/images/${armor.armorPiece}_${armor.rarity}.webp`}
      ></img>
      <div className="flex flex-col">
        <p className="">{armor.armor}</p>
        <div className="flex gap-2">
          <p className="">Rarity: {armor.rarity}</p>
          <p className="">Type: {typeMap[armor.type]}</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col flex-7">
      <div className="flex gap-2">
        <p>
          Def: {armor.defense.min}-{armor.defense.max}
        </p>
        <div className="flex gap-2">
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
      </div>
      <div className="flex gap-1 items-baseline">
        <span>Skills: </span>
        <div className="flex flex-wrap gap-0.5 leading-none">
          {armor.skills.map((skill: SkillMap, n) => (
            <span key={n}>
              [{skill.name}: {skill.level}]
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const ArmorList = ({
  armors,
  parentRef,
}: {
  armors: ArmorItem[];
  parentRef: RefObject<HTMLDivElement>;
}) => {
  const rowVirtualizer = useVirtualizer({
    count: armors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <>
      <div className={`h-[${rowVirtualizer.getTotalSize}] relative`}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const armor = armors[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              className={`absolute top-0 left-0 w-full `}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ArmorRow armor={armor} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ArmorList;
