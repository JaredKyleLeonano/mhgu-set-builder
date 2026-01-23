import { useState, useEffect, useMemo, use } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  getByRarity,
  maxSkillPossible,
  getFilteredArmors,
  getSkills,
} from "./queries.ts";
import type { ArmorItem, SkillType } from "./queries.ts";
// import database from "./db/database.ts";
import EquippedPiece from "./components/EquippedPiece.tsx";
import ArmorBuilder from "./components/ArmorBuilder.tsx";
import SetBuilder from "./components/SetBuilder.tsx";

function App() {
  const [allSkills, setAllSkills] = useState<SkillTreeMap>({});

  type SkillTreeMap = Record<string, { type: string; details: SkillType[] }>;

  type SkillTreeType = {
    skillTree: string;
    type: string;
    details: SkillType[];
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

  const [selectedArmor, setSelectedArmor] = useState<PieceType>({
    Head: null,
    Torso: null,
    Arms: null,
    Waist: null,
    Legs: null,
  });

  const [accumulatedSkills, setAccumulatedSkills] =
    useState<AccumulatedSkillsType>({
      Head: null,
      Torso: null,
      Arms: null,
      Waist: null,
      Legs: null,
    });

  const [allArmors, setAllArmors] = useState<ArmorItem[]>([]);
  const [armorBuilderSelected, setArmorBuilderSelected] = useState(true);
  useEffect(() => {
    (async () => {
      const armors = (await getByRarity(11)) as ArmorItem[];
      // console.log("Armors:", armors);
      setAllArmors(armors);

      const skills = (await getSkills()) as SkillTreeType[];
      console.log("SKILL TREE", skills);
      const skillTreeRecord = skills.reduce(
        (acc, entry) => (
          (acc[entry.skillTree] = {
            type: entry.type,
            details: [...entry.details],
          }),
          acc
        ),
        {} as SkillTreeMap,
      );
      // console.log("SKILL", skillTreeRecord);
      setAllSkills(skillTreeRecord);
    })();

    //preload images
    for (let i = 1; i <= 11; i++) {
      // console.log(i);
      new Image().src = `assets/images/Head${i}.webp`;
      new Image().src = `assets/images/Torso${i}.webp`;
      new Image().src = `assets/images/Arms${i}.webp`;
      new Image().src = `assets/images/Waist_${i}.webp`;
      new Image().src = `assets/images/Legs${i}.webp`;
    }
  }, []);

  // database();
  return (
    <div className="flex flex-col relative gap-4 h-screen w-screen bg-[#222222] overflow-clip">
      <div className="h-full w-full flex justify-center items-center absolute">
        <img
          src={"/assets/images/Hunter's_Guild_Crest.svg"}
          className="h-124 w-124 opacity-100"
        />
      </div>
      <div className="h-full w-full flex justify-center items-center absolute">
        <img src={"/assets/images/bg.webp"} className="opacity-60" />
      </div>
      <div className="flex w-full justify-center z-10">
        <h1 className="text-6xl">MHGU Set Builder</h1>
      </div>
      <div className="flex flex-1 m-4 gap-8 z-10">
        <div className="flex flex-col flex-3 overflow-auto rounded-t-2xl border border-black">
          <div className="flex items-center w-full p-4 bg-[#6a3237] border-b border-black">
            <h2 className="text-[#d4a553] text-2xl font-inter">Equipment</h2>
          </div>
          <div className="h-full bg-[#461919E6]">
            <div className="flex flex-col h-full p-2 justify-between">
              {(Object.keys(selectedArmor) as (keyof PieceType)[]).map(
                (piece) => (
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
                ),
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-7">
          <div className="flex justify-between items-center h-18 bg-gray-300 rounded-t-2xl border border-black">
            <div className="flex gap-3 justify-around h-full">
              <div className="w-8 bg-[#b57131] rounded-tl-2xl"></div>
              <div className="w-4 bg-[#29b4b0]"></div>
              <div className="w-4 bg-[#b57131]"></div>
            </div>
            <div className=" w-72 h-[80%] bg-[#b57131] rounded-3xl p-1">
              <div className="relative flex items-center w-full h-full bg-[#5c5954] rounded-3xl overflow-clip">
                <div className="absolute flex w-full h-full">
                  <div
                    className={`flex flex-1  transition-all duration-300 ease-in-out rounded-r-2xl ${
                      armorBuilderSelected
                        ? "bg-[#29b4b0] scale-x-125 z-20"
                        : "bg-[#5c5954] z-10"
                    }`}
                  ></div>
                  <div
                    className={`flex-1 transition-all duration-300 ease-in-out rounded-l-2xl ${
                      armorBuilderSelected
                        ? "bg-[#5c5954] z-10"
                        : "bg-[#29b4b0] scale-x-125 z-20"
                    }`}
                  ></div>
                </div>
                <button
                  onClick={() => {
                    setArmorBuilderSelected(true);
                  }}
                  className={`flex-1 text-center  font-bold z-30 font-inter leading-tight transition-all duration-300 text-sm text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
                    armorBuilderSelected
                      ? "opacity-100"
                      : "opacity-40 cursor-pointer"
                  }`}
                >
                  Armor<br></br>Builder
                </button>
                <button
                  onClick={() => {
                    setArmorBuilderSelected(false);
                  }}
                  className={`flex-1 text-center  font-bold z-30 font-inter leading-tight transition-all duration-300 text-sm text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill] ${
                    armorBuilderSelected
                      ? "opacity-40 cursor-pointer"
                      : "opacity-100"
                  }`}
                >
                  Set<br></br>Builder
                </button>
              </div>
            </div>
            <div className="flex gap-3 justify-around h-full">
              <div className="w-4 bg-[#b57131]"></div>
              <div className="w-4 bg-[#29b4b0]"></div>
              <div className="w-8 bg-[#b57131] rounded-tr-2xl"></div>
            </div>
          </div>
          <div className="flex relative bg-[#D4B483B3] border-l border-r border-b border-black h-full">
            <div
              className={`absolute inset-0 p-4 transition-opacity duration-200 ease-in-out ${armorBuilderSelected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} w-full`}
            >
              <ArmorBuilder
                allArmors={allArmors}
                allSkills={allSkills}
                selectedArmor={selectedArmor}
                setSelectedArmor={setSelectedArmor}
                accumulatedSkills={accumulatedSkills}
                setAccumulatedSkills={setAccumulatedSkills}
              ></ArmorBuilder>
            </div>
            <div
              className={`absolute inset-0 p-4 transition-opacity duration-200 ease-in-out ${armorBuilderSelected ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} w-full`}
            >
              <SetBuilder
                selectedArmor={selectedArmor}
                setSelectedArmor={setSelectedArmor}
                allSkills={allSkills}
                accumulatedSkills={accumulatedSkills}
                setAccumulatedSkills={setAccumulatedSkills}
              ></SetBuilder>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
