import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";
import type {
  PieceType,
  AccumulatedSkillsType,
  ArmorItem,
  SkillTreeMap,
} from "../../types";

type AppContextType = {
  selectedArmor: PieceType;
  setSelectedArmor: Dispatch<SetStateAction<PieceType>>;
  accumulatedSkills: AccumulatedSkillsType;
  setAccumulatedSkills: Dispatch<SetStateAction<AccumulatedSkillsType>>;
  allArmors: ArmorItem[];
  setAllArmors: Dispatch<SetStateAction<ArmorItem[]>>;
  allSkills: SkillTreeMap;
  setAllSkills: Dispatch<SetStateAction<SkillTreeMap>>;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
