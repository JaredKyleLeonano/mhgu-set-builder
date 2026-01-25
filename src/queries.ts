import database from "./db/database";
import type {
  ArmorItem,
  ArmorPiece,
  ArmorMap,
  SkillType,
  SkillMap,
} from "./types";

export const getFilteredArmors = (
  maxSkillPossible: SkillMap[],
  armors: ArmorMap,
  requiredSkills: SkillMap,
) => {
  const labels = Object.keys(armors);
  console.log("REQUIRED SKILL", requiredSkills);

  for (const armorPiece of Object.keys(armors)) {
    armors[armorPiece as ArmorPiece].sort(
      (a, b) => b.defense.min - a.defense.min,
    );
  }
  const chosenArmors: ArmorItem[][] = [];

  const prioArmors: ArmorItem[][] = [];
  console.log("OBJECT VALUES", Object.values(armors));
  const armorsByPiece = Object.values(armors);
  for (let i = 0; i < Object.values(armors).length; i++) {
    console.log("INDEX IS:", i);
    prioArmors[i] = armorsByPiece[i]
      .filter((armor: ArmorItem) =>
        armor.skills.some((skill) => requiredSkills[skill.name]),
      )
      .sort((a, b) => {
        const pointsA = a.skills.reduce(
          (acc, skill) => acc + (requiredSkills[skill.name] ? skill.level : 0),
          0,
        );
        const pointsB = b.skills.reduce(
          (acc, skill) => acc + (requiredSkills[skill.name] ? skill.level : 0),
          0,
        );
        return pointsB - pointsA;
      });
  }

  console.log("OBJECT VALUES REQUIRED SKILLS", Object.values(requiredSkills));

  const bestSkillResult: SkillMap = {};
  for (const armorPieces of prioArmors) {
    const bestPieceWeight = armorPieces.reduce(
      (best, armor) => {
        let skillTotal = 0;
        for (const skill of armor.skills) {
          if (requiredSkills[skill.name]) {
            skillTotal +=
              Math.min(skill.level, requiredSkills[skill.name]) /
              requiredSkills[skill.name];
          }
        }
        const finalWeight = skillTotal / Object.values(requiredSkills).length;

        if (finalWeight > best.weight) {
          return { armor: armor, weight: finalWeight };
        } else return best;
      },
      { armor: {} as ArmorItem, weight: 0 },
    );

    for (const skill of bestPieceWeight.armor.skills) {
      if (requiredSkills[skill.name]) {
        bestSkillResult[skill.name] =
          (bestSkillResult[skill.name] || 0) + skill.level;
      }
    }
  }

  console.log("BEST SKILL RESULT IS:", bestSkillResult);

  for (const key of Object.keys(requiredSkills)) {
    if (requiredSkills[key] > bestSkillResult[key]) {
      console.log("IMPOSSIBLE COMBO");
      return chosenArmors;
    }
  }

  console.log("PRIORITY ARMORS", prioArmors);

  const backtrack = (
    slotIndex: number,
    currentSkills: SkillMap,
    selectedArmors: ArmorItem[],
  ) => {
    if (chosenArmors.length >= 100) {
      return; // stop if we've found enough combinations
    }

    if (slotIndex === labels.length) {
      for (const skill in requiredSkills) {
        if ((currentSkills[skill] || 0) < requiredSkills[skill]) {
          return;
        }
      }
      chosenArmors.push([...selectedArmors]);
      return;
    }

    // console.log("SLOT INDEX", slotIndex);

    console.log("LABELS LENGTH IS:", labels.length);
    console.log("CURRENT SLOT INDEX IS:", slotIndex);
    console.log("CURRENT LABEL IS:", labels[slotIndex]);
    console.log("ARMORS WITHIN BACKTRACK ARE:", armors);
    const orderedArmors = [
      ...(prioArmors[slotIndex] || []),
      ...armors[labels[slotIndex] as ArmorPiece].filter(
        (a) => !(prioArmors[slotIndex] || []).includes(a),
      ),
    ];
    console.log("ORDERED ARMORS ARE:", orderedArmors);

    let skillAchieved = true;
    for (const skill of Object.keys(requiredSkills)) {
      if ((currentSkills[skill] ?? 0) < requiredSkills[skill]) {
        skillAchieved = false;
        break;
      }
    }

    for (const armor of skillAchieved
      ? armors[labels[slotIndex] as ArmorPiece]
      : orderedArmors) {
      console.log("THIS RAN WITHIN THE FOR LOOP");
      const updatedSkills = addSkills(currentSkills, armor.skills);

      if (
        skillsInsufficient(
          slotIndex + 1,
          updatedSkills,
          maxSkillPossible,
          requiredSkills,
        )
      ) {
        continue;
      }

      selectedArmors.push(armor);
      backtrack(slotIndex + 1, updatedSkills, selectedArmors);
      selectedArmors.pop();
    }
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
  const slotMaxCompiled: SkillMap[] = [];

  for (let i = 0; i < labels.length; i++) {
    const slotMax: SkillMap = {};
    for (const armor of armors[labels[i] as ArmorPiece]) {
      for (const skill of armor.skills) {
        slotMax[skill.name] = Math.max(slotMax[skill.name] ?? 0, skill.level);
      }
    }
    slotMaxCompiled.push(slotMax);
  }

  return slotMaxCompiled;
};

export const groupByArmorPieceAndType = (
  data: Array<ArmorItem>,
  type: number | undefined,
) => {
  if (!type) return;
  const toReturn = data.reduce(
    (acc, item: ArmorItem) => {
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
  return toReturn;
};

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
