import { useEffect } from "react";
import "./App.css";
import { getByRarity, getSkills } from "./queries.ts";
import { useAppContext } from "./components/Hooks/UseAppContext.ts";
import TitleCard from "./components/TitleCard.tsx";
import EquippedArmor from "./components/EquippedArmor.tsx";
import BuilderContainer from "./components/BuilderContainer.tsx";
import type { SkillTreeMap, SkillTreeType, ArmorItem } from "./types.ts";

function App() {
  const { setAllArmors, setAllSkills } = useAppContext();

  useEffect(() => {
    (async () => {
      const armors = (await getByRarity(11)) as ArmorItem[];
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
  }, [setAllArmors, setAllSkills]);

  return (
    <div className="flex flex-col relative gap-2 h-screen w-screen bg-[#222222] overflow-clip">
      <div className="h-full w-full flex justify-center items-center absolute">
        <img
          src={"/assets/images/Hunter's_Guild_Crest.svg"}
          className="h-124 w-124 opacity-100"
        />
      </div>
      <div className="h-full w-full flex justify-center items-center absolute">
        <img src={"/assets/images/bg.webp"} className="opacity-60" />
      </div>
      <TitleCard></TitleCard>
      <div className="flex flex-1 mb-4 ml-4 mr-4 gap-8 z-10">
        <EquippedArmor></EquippedArmor>
        <BuilderContainer></BuilderContainer>
      </div>
    </div>
  );
}

export default App;
