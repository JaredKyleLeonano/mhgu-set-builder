import database from "./db/database";

type ArmorPiece = "Head" | "Torso" | "Arms" | "Waist" | "Legs";
export type SkillMap = Record<string, number>;

export interface SkillType {
  name: string;
  level: number;
  description: string;
}

type ArmorMap = Record<ArmorPiece, ArmorItem[]>;

type SkillWithSource = {
  level: number;
  armor: string;
};
type SkillArmorMap = Record<string, SkillWithSource>;

export interface ArmorItem {
  id: string;
  type: number;
  armorPiece: ArmorPiece;
  rarity: number;
  set: string;
  armor: string;
  defense: {
    min: number;
    max: number;
  };
  elemRes: {
    fire: number;
    water: number;
    thunder: number;
    ice: number;
    dragon: number;
  };
  slots: number;
  skills: SkillType[];
}

export const getFilteredArmors = (
  maxSkillPossible: SkillMap[],
  armors: ArmorMap,
  requiredSkills: SkillMap,
) => {
  const labels = Object.keys(armors);
  // console.log("max possible skills", maxSkillPossible);
  // console.log("selected armors", armors);
  // console.log("REQUIRED SKILL", requiredSkills);

  for (const armorPiece of Object.keys(armors)) {
    armors[armorPiece as ArmorPiece].sort(
      (a, b) => b.defense.min - a.defense.min,
    );
  }
  const chosenArmors: ArmorItem[][] = [];

  const backtrack = (
    slotIndex: number,
    currentSkills: SkillMap,
    selectedArmors: ArmorItem[],
  ): boolean => {
    // console.log("SLOT INDEX", slotIndex);
    if (slotIndex === labels.length) {
      // ✅ after all slots are filled
      // Check all required skills
      for (const skill in requiredSkills) {
        if ((currentSkills[skill] || 0) < requiredSkills[skill]) {
          return false; // invalid combination → exit this branch
        }
      }

      // ✅ All skills met → save combination
      chosenArmors.push([...selectedArmors]);

      if (chosenArmors.length >= 10) {
        return true; // stop if we've found enough combinations
      }
      return false;
    }

    for (const armor of armors[labels[slotIndex] as ArmorPiece]) {
      const updatedSkills = addSkills(currentSkills, armor.skills);

      if (
        skillsInsufficient(
          slotIndex,
          updatedSkills,
          maxSkillPossible,
          requiredSkills,
        )
      ) {
        return false;
      }

      selectedArmors.push(armor);
      const shouldStop = backtrack(
        slotIndex + 1,
        updatedSkills,
        selectedArmors,
      );
      selectedArmors.pop();

      if (shouldStop) return true;
    }

    return false;
  };
  backtrack(0, {}, []);
  console.log("CHOSEN ARMORS", chosenArmors);
  return chosenArmors;
};

const addSkills = (baseSkills: SkillMap, toAdd: SkillType[]) => {
  const result: SkillMap = { ...baseSkills };
  for (const skill of toAdd) {
    result[skill.name] = (result[skill.name] || 0) + skill.level;
  }
  return result;
};

//CHECK THIS ON HOW IT CALCULATES MAX POSSIBLE SKILLS
const skillsInsufficient = (
  slotIndex: number,
  currentSkills: SkillMap,
  maxSkillPossible: SkillMap[],
  requiredSkills: SkillMap,
) => {
  const computedMaxSkillPossible: SkillMap = {};

  for (let i = slotIndex; i < maxSkillPossible.length; i++) {
    for (const skill of Object.keys(maxSkillPossible[i])) {
      computedMaxSkillPossible[skill] =
        (computedMaxSkillPossible[skill] ?? 0) + maxSkillPossible[i][skill];
    }
  }

  for (const skill in requiredSkills) {
    const currentValue = currentSkills[skill] || 0;
    const maxPossible = currentValue + (computedMaxSkillPossible[skill] || 0);

    if (maxPossible < requiredSkills[skill]) {
      return true;
    }
  }
  return false;
};

export const maxSkillPossible = (armors: ArmorMap) => {
  const labels = Object.keys(armors);
  // console.log("LABELS", labels.length);
  const maxRemainingSkills: SkillMap[] = [];
  const slotMaxCompiled: SkillMap[] = [];

  for (let i = 0; i < labels.length; i++) {
    const slotMax: SkillMap = {};
    for (const armor of armors[labels[i] as ArmorPiece]) {
      for (const skill of armor.skills) {
        slotMax[skill.name] = Math.max(slotMax[skill.name] ?? 0, skill.level);

        // console.log("SLOT MAX", slotMax[skill.name]);
      }
    }
    slotMaxCompiled.push(slotMax);
  }

  // console.log("SLOT MAX COMPILED", slotMaxCompiled[0]);

  // for (let i = 0; i < labels.length; i++) {
  //   const maxSkillsCombi: SkillMap = {};

  //   for (let j = i; j < labels.length; j++) {
  //     const slotMax: SkillArmorMap = {};

  //     // find best armor IN THIS SLOT
  //     for (const armor of armors[labels[j] as ArmorPiece]) {
  //       for (const skill of armor.skills) {
  //         // console.log("CONSIDERING SKILL", skill);
  //         const prev = slotMax[skill.name];
  //         if (!prev || skill.level > prev.level) {
  //           slotMax[skill.name] = {
  //             level: Math.max(slotMax[skill.name]?.level || 0, skill.level),
  //             armor: armor.armor,
  //           };
  //         }
  //       }
  //     }
  //     // slotMaxCompiled.push(slotMax);
  //     // console.log("SLOT MAX", slotMax);
  //     // console.log("FOR ARMOR PIECE", labels[j]);

  //     // add slot max to total
  //     for (const skill in slotMax) {
  //       maxSkillsCombi[skill] =
  //         (maxSkillsCombi[skill] || 0) + slotMax[skill].level;
  //     }
  //   }

  //   maxRemainingSkills.push(maxSkillsCombi);
  // }
  return slotMaxCompiled;
};

export const groupByArmorPieceAndType = (
  data: Array<ArmorItem>,
  type: number | undefined,
) => {
  if (!type) return;
  // console.log("GROUPING BY TYPE", type);
  const toReturn = data.reduce(
    (acc, item: ArmorItem) => {
      // console.log("ITEM TYPE", item.type, item);
      if (item.type == type || type === 3) {
        acc[item.armorPiece].push(item);
      }
      return acc;
    },
    {
      Head: [] as ArmorItem[],
      Torso: [] as ArmorItem[],
      Arms: [] as ArmorItem[],
      Waist: [] as ArmorItem[],
      Legs: [] as ArmorItem[],
    } as ArmorMap,
  );

  // for (const armorPiece of Object.keys(toReturn)) {
  //   toReturn[armorPiece as ArmorPiece].sort(
  //     (a, b) => b.defense.min - a.defense.min
  //   );
  // }
  // console.log("TO RETURN", toReturn);
  return toReturn;
};

// export const getByRarity = async (rarity: Array<number>) => {
//   const db = await database();
//   console.log("DB IN GET BY RARITY", db);
//   const transaction = db.transaction("armors", "readonly");
//   const store = transaction.objectStore("armors");
//   const rarityIndex = store.index("rarity");

//   return new Promise((resolve, reject) => {
//     const compiled: ArmorItem[] = [];
//     let pending = rarity.length;

//     for (const n of rarity) {
//       const subQuery = rarityIndex.getAll(n);
//       subQuery.onsuccess = () => {
//         compiled.push(...subQuery.result);
//         pending--;
//         if (pending === 0) {
//           console.log("COMPILED ARMORS BY RARITY", compiled);
//           resolve(compiled);
//         }
//       };
//       subQuery.onerror = () => {
//         reject(subQuery.error);
//       };
//     }
//   });
// };

export const getByRarity = async (max: number) => {
  if (!max) return;
  const db = await database();
  const transaction = db.transaction("armors", "readonly");
  const store = transaction.objectStore("armors");
  const rarityIndex = store.index("rarity");

  return new Promise<ArmorItem[]>((resolve, reject) => {
    const range = IDBKeyRange.bound([1], [max, Infinity]);
    const request = rarityIndex.getAll(range);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getSkills = async () => {
  const db = await database();
  const transaction = db.transaction("skills", "readonly");
  const store = transaction.objectStore("skills");
  const rarityIndex = store.index("skillTree");

  return new Promise((resolve, reject) => {
    const request = rarityIndex.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
