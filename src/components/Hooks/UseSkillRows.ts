import { useMemo } from "react";
import { useAppContext } from "./UseAppContext";
import type { CompiledSkillsType } from "../../types";

const useSkillRows = () => {
  const { accumulatedSkills, allSkills } = useAppContext();

  const armorSortMap: Record<string, number> = useMemo(
    () => ({
      Head: 0,
      Torso: 1,
      Arms: 2,
      Waist: 3,
      Legs: 4,
    }),
    [],
  );

  return useMemo(() => {
    const compiledSkills: CompiledSkillsType = {};
    const rows = [];
    let count = 0;

    for (const [piece, skills] of Object.entries(accumulatedSkills)) {
      if (skills) {
        for (const skill of skills) {
          if (!compiledSkills[skill.name]) {
            compiledSkills[skill.name] = Array(6).fill(undefined);
          }
          compiledSkills[skill.name][armorSortMap[piece]] = skill.level;
        }
      }
    }

    for (const [skillTree, levels] of Object.entries(compiledSkills)) {
      levels[5] = levels.reduce((acc, lvl) => acc + (lvl ?? 0), 0);

      let activated;
      for (const details of allSkills[skillTree].details) {
        if (details.level > 0 && levels[5] >= details.level) {
          activated = details.name;
          break;
        }
      }

      if (activated) {
        rows.unshift([skillTree, ...levels, activated]);
        count++;
      } else {
        rows.push([skillTree, ...levels, activated]);
      }
    }

    return { skillRows: rows, activatedCount: count };
  }, [accumulatedSkills, allSkills, armorSortMap]);
};

export default useSkillRows;
