import type { ArmorItem, SkillType } from "../types.ts";
import { typeMap } from "../types.ts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, type RefObject } from "react";
import { useAppContext } from "./Hooks/UseAppContext.ts";

const ArmorRow = memo(({ armor }: { armor: ArmorItem }) => {
  const { setSelectedArmor, setAccumulatedSkills } = useAppContext();
  return (
    <button
      onClick={() => {
        setSelectedArmor((prev) => ({ ...prev, [armor.armorPiece]: armor }));
        setAccumulatedSkills((prev) => ({
          ...prev,
          [armor.armorPiece]: armor.skills,
        }));
      }}
      className="flex justify-center w-full rounded-2xl bg-[#D6C9AD] hover:bg-[#C8BA9D] hover:shadow-sm transition-all duration-300 ease-out cursor-pointer py-1 px-4 lg:px-2 text-xs md:text-sm xl:text-xs"
    >
      <div className="w-full md:w-[80%] lg:w-[95%] xl:w-full 2xl:w-[87%] full-2xl:w-full grid grid-cols-[1fr_2fr_2fr_2fr_2fr_2fr] md:grid-cols-[0.2fr_0.6fr_1fr_0.5fr_1fr] xl:grid-cols-[1fr_1.5fr_2fr_1fr_2.5fr_3fr_2.4fr_2fr] 2xl:grid-cols-[0.2fr_0.6fr_1fr_0.5fr_1fr] full-2xl:xl:grid-cols-[1fr_1.5fr_2fr_1fr_2.5fr_3fr_2.4fr_2fr] justify-items-start items-start gap-y-1 md:gap-y-0 xl:gap-y-0 auto-rows-min auto-cols-min">
        <img
          key={`${armor.armorPiece}_${armor.rarity}`}
          className="h-5 w-5 xl:w-8 xl:h-8 xl:row-span-2 2xl:h-5 2xl:w-5 2xl:row-span-1 full-2xl:w-8 full-2xl:h-8 full-2xl:row-span-2"
          src={`/assets/images/${armor.armorPiece}_${armor.rarity}.webp`}
          loading="eager"
          decoding="sync"
        ></img>
        <p className="font-semibold col-span-2 md:col-start-2 xl:row-start-1 xl:col-start-2 xl:col-span-3 2xl:col-span-2 2xl:col-start-2 full-2xl:row-start-1 full-2xl:col-start-2 full-2xl:col-span-3">
          {armor.armor}
        </p>
        <p className="row-start-2 col-span-2 xl:row-start-1 xl:col-start-5 2xl:row-start-2 2xl:col-span-2 full-2xl:row-start-1 full-2xl:col-start-5">
          Def: {armor.defense.min}-{armor.defense.max}
        </p>
        <div className="flex gap-1 col-span-3 md:row-start-2 md:col-start-3 md:justify-self-start md:col-span-2 xl:justify-self-start xl:row-start-1 xl:col-start-6 xl:col-span-2 2xl:row-start-2 2xl:col-start-3 2xl:justify-self-start 2xl:col-span-2 full-2xl:justify-self-start full-2xl:row-start-1 full-2xl:col-start-6 full-2xl:col-span-2">
          <div className="flex items-center">
            <img
              className="h-4 w-4 md:h-4 md:w-4 lg:h-4 lg:w-4"
              src="/assets/images/fire.webp"
            ></img>
            <p>: {armor.elemRes.fire}</p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4 " src="/assets/images/water.webp"></img>
            <p>: {armor.elemRes.water}</p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4 " src="/assets/images/thunder.webp"></img>
            <p>: {armor.elemRes.thunder}</p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4 " src="/assets/images/ice.webp"></img>
            <p>: {armor.elemRes.ice}</p>
          </div>
          <div className="flex items-center">
            <img className="h-4 w-4 " src="/assets/images/dragon.webp"></img>
            <p>: {armor.elemRes.dragon}</p>
          </div>
        </div>
        <p className="md:row-start-2 md:justify-self-end md:col-start-5 xl:row-start-1 xl:col-start-8 2xl:row-start-2 2xl:justify-self-end 2xl:col-start-5 full-2xl:row-start-1 full-2xl:col-start-8">
          Slots: {"O".repeat(armor.slots) + "-".repeat(3 - armor.slots)}
        </p>
        <p className="row-start-1 col-start-4 md:justify-self-end xl:justify-self-start xl:row-start-2 xl:col-start-2 2xl:row-start-1 2xl:col-start-4 2xl:justify-self-end full-2xl:justify-self-start full-2xl:row-start-2 full-2xl:col-start-2">
          Rarity: {armor.rarity}
        </p>
        <p className="justify-self-end row-start-1 col-start-5 col-span-2 md:row-start-1 md:col-start-5 md:col-span-1 xl:row-start-2 xl:col-start-3 xl:col-span-2 xl:justify-self-start 2xl:row-start-1 2xl:col-start-5 2xl:col-span-1 2xl:justify-self-end full-2xl:row-start-2 full-2xl:col-start-3 full-2xl:col-span-2 full-2xl:justify-self-start">
          Type: {typeMap[armor.type]}
        </p>

        <div className="flex w-full row-start-3 col-span-6 xl:row-start-2 xl:col-start-5 xl:col-span-4 gap-1 justify-start items-baseline 2xl:row-start-3 2xl:col-span-6 full-2xl:row-start-2 full-2xl:col-start-5 full-2xl:col-span-4">
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
  );
});

const ArmorList = ({
  armors,
  parentRef,
}: {
  armors: ArmorItem[];
  parentRef: RefObject<HTMLDivElement | null>;
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
                <ArmorRow armor={armor} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ArmorList;
