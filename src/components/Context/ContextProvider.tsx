import { useState, useMemo } from "react";
import type {
  PieceType,
  AccumulatedSkillsType,
  SkillTreeMap,
  ArmorItem,
} from "../../types";
import AppContext from "./AppContext";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
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

  const [allSkills, setAllSkills] = useState<SkillTreeMap>({});
  const [allArmors, setAllArmors] = useState<ArmorItem[]>([]);

  const value = useMemo(
    () => ({
      selectedArmor,
      setSelectedArmor,
      accumulatedSkills,
      setAccumulatedSkills,
      allSkills,
      setAllSkills,
      allArmors,
      setAllArmors,
    }),
    [selectedArmor, accumulatedSkills, allSkills, allArmors],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default ContextProvider;
