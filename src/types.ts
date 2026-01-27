export interface SkillType {
  name: string;
  level: number;
  description: string;
}
export type ArmorPiece = "Head" | "Torso" | "Arms" | "Waist" | "Legs";

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

export type ArmorMap = Record<ArmorPiece, ArmorItem[]>;

export const typeMap: Record<number, string> = {
  1: "Blademaster",
  2: "Gunner",
  3: "Both",
};

export type SkillMap = Record<string, number>;

export type SkillTreeMap = Record<
  string,
  { type: string; details: SkillType[] }
>;

export type SkillTreeType = {
  skillTree: string;
  type: string;
  details: SkillType[];
};

export type PieceType = {
  Head: ArmorItem | null;
  Torso: ArmorItem | null;
  Arms: ArmorItem | null;
  Waist: ArmorItem | null;
  Legs: ArmorItem | null;
};

export type AccumulatedSkillsType = {
  Head: SkillType[] | null;
  Torso: SkillType[] | null;
  Arms: SkillType[] | null;
  Waist: SkillType[] | null;
  Legs: SkillType[] | null;
};

export type CompiledSkillsType = Record<string, number[]>;

export type PieceFilterType = {
  Head: boolean;
  Torso: boolean;
  Arms: boolean;
  Waist: boolean;
  Legs: boolean;
};

export type RankFilterType = {
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
  11: boolean;
};
