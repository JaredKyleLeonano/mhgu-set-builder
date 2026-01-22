import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://monsterhunter.fandom.com/wiki/MHGU:_Skill_List";

const retrievedSkills = [];

const skillCategoryMap = {
  Evasion: "Survival",
  Sheathing: "Survival",
  "Evade Dist": "Survival",
  Bubble: "Survival",
  Guard: "Survival",
  "Guard Up": "Survival",
  Guts: "Survival",
  Sense: "Survival",
  Protection: "Survival",
  "Hero Shield": "Survival",
  "Rec Speed": "Survival",
  Maestro: "Item",
  "Bomb Boost": "Item",
  "Rec Level": "Item",
  "Lasting Pwr": "Item",
  "Wide-Range": "Item",
  Gluttony: "Item",
  Eating: "Item",
  "Light Eater": "Item",
  Carnivore: "Item",
  Mycology: "Item",
  Botany: "Item",
  "Combo Rate": "Item",
  "Combo Plus": "Item",
  "Speed Setup": "Item",
  "Heat Res": "Quest",
  "Cold Res": "Quest",
  Stamina: "Quest",
  Constitution: "Quest",
  "Stam Recov": "Quest",
  "Distance Runner": "Quest",
  TeamPlayer: "Quest",
  TeamLeader: "Quest",
  Psychic: "Quest",
  Perception: "Quest",
  Ranger: "Quest",
  Transporter: "Quest",
  Hunger: "Quest",
  Gathering: "Quest",
  Honey: "Quest",
  Charmer: "Quest",
  Whim: "Quest",
  Fate: "Quest",
  Carving: "Quest",
  Capturer: "Quest",
  Poison: "Negate",
  Paralysis: "Negate",
  Sleep: "Negate",
  Stun: "Negate",
  Hearing: "Negate",
  "Wind Res": "Negate",
  "Tremor Res": "Negate",
  "Bind Res": "Negate",
  "Anti-Theft": "Negate",
  "Def Lock": "Negate",
  "Frenzy Res": "Negate",
  Biology: "Negate",
  Bleeding: "Negate",
  "Blight Res": "Negate",
  Attack: "Parameter Change",
  Defense: "Parameter Change",
  Health: "Parameter Change",
  "Fire Res": "Parameter Change",
  "Water Res": "Parameter Change",
  "Thunder Res": "Parameter Change",
  "Ice Res": "Parameter Change",
  "Dragon Res": "Parameter Change",
  ColdBlooded: "Attack",
  HotBlooded: "Attack",
  "Fire Atk": "Attack",
  "Water Atk": "Attack",
  "Thunder Atk": "Attack",
  "Ice Atk": "Attack",
  "Dragon Atk": "Attack",
  Elemental: "Attack",
  Status: "Attack",
  Sharpener: "Attack",
  Handicraft: "Attack",
  Sharpness: "Attack",
  Fencing: "Attack",
  Grinder: "Attack",
  Blunt: "Attack",
  "Crit Draw": "Attack",
  "Punish Draw": "Attack",
  "Sheath Sharpen": "Attack",
  Bladescale: "Attack",
  Loading: "Attack",
  Expert: "Attack",
  Tenderizer: "Attack",
  "Chain Crit": "Attack",
  "Crit Status": "Attack",
  "Crit Element": "Attack",
  "Critical Up": "Attack",
  "Negative Crit": "Attack",
  FastCharge: "Attack",
  KO: "Attack",
  "Stam Drain": "Attack",
  Artillery: "Attack",
  Destroyer: "Attack",
  "Gloves Off": "Attack",
  Spirit: "Attack",
  Unscathed: "Attack",
  Chance: "Attack",
  "Dragon Spirit": "Attack",
  Potential: "Attack",
  Survivor: "Attack",
  Furor: "Attack",
  Crisis: "Attack",
  Mounting: "Attack",
  Vault: "Attack",
  Insight: "Attack",
  Endurance: "Attack",
  "Prolong SP": "Attack",
  Bherna: "Multi Skill",
  Kokoto: "Multi Skill",
  Pokke: "Multi Skill",
  Yukumo: "Multi Skill",
  Soaratorium: "Multi Skill",
  "Flying Pub": "Multi Skill",
  Redhelm: "Multi Skill",
  Snowbaron: "Multi Skill",
  Stonefist: "Multi Skill",
  Drilltusk: "Multi Skill",
  Dreadqueen: "Multi Skill",
  Crystalbeard: "Multi Skill",
  Silverwind: "Multi Skill",
  Deadeye: "Multi Skill",
  Dreadking: "Multi Skill",
  Thunderlord: "Multi Skill",
  Grimclaw: "Multi Skill",
  Hellblade: "Multi Skill",
  Nightcloak: "Multi Skill",
  Rustrazor: "Multi Skill",
  Soulseer: "Multi Skill",
  Boltreaver: "Multi Skill",
  Elderfrost: "Multi Skill",
  Bloodbath: "Multi Skill",
  "Redhelm X": "Multi Skill",
  "Snowbaron X": "Multi Skill",
  "Stonefist X": "Multi Skill",
  "Drilltusk X": "Multi Skill",
  "Dreadqueen X": "Multi Skill",
  "Crystalbeard X": "Multi Skill",
  "Silverwind X": "Multi Skill",
  "Deadeye X": "Multi Skill",
  "Dreadking X": "Multi Skill",
  "Thunderlord X": "Multi Skill",
  "Grimclaw X": "Multi Skill",
  "Hellblade X": "Multi Skill",
  "Nightcloak X": "Multi Skill",
  "Rustrazor X": "Multi Skill",
  "Soulseer X": "Multi Skill",
  "Boltreaver X": "Multi Skill",
  "Elderfrost X": "Multi Skill",
  "Bloodbath X": "Multi Skill",
  "D. Fencing": "Multi Skill",
  "Edge Lore": "Multi Skill",
  PowerEater: "Multi Skill",
  Mechanic: "Multi Skill",
  Brawn: "Multi Skill",
  Prayer: "Multi Skill",
  Covert: "Multi Skill",
  Edgemaster: "Multi Skill",
  "Status Res": "Multi Skill",
  Fury: "Multi Skill",
  Nimbleness: "Multi Skill",
  Readiness: "Multi Skill",
  Resilience: "Multi Skill",
  Brutality: "Multi Skill",
  Stalwart: "Multi Skill",
  Prudence: "Multi Skill",
  Amplify: "Multi Skill",
  Hoarding: "Multi Skill",
  Avarice: "Multi Skill",
  "Anti-Chameleos": "Multi Skill",
  "Anti-Teostra": "Multi Skill",
  "Anti-Kushala": "Multi Skill",
  "Ammo Saver": "Item",
  "Blast C+": "Attack",
  "C.Range C+": "Attack",
  "Clust S+": "Attack",
  "Crag S+": "Attack",
  "Dead Eye": "Attack",
  "Elem C+": "Attack",
  "Exhaust C+": "Attack",
  Haphazard: "Attack",
  "Heavy Up": "Attack",
  "Normal S+": "Attack",
  "Normal Up": "Attack",
  "Para C+": "Attack",
  "Pellet S+": "Attack",
  "Pellet Up": "Attack",
  "Pierce S+": "Attack",
  "Pierce Up": "Attack",
  "Poison C+": "Attack",
  "Power C+": "Attack",
  Precision: "Attack",
  Recoil: "Attack",
  "Rapid Fire": "Attack",
  "Reload Spd": "Attack",
  "Secret Art": "Item",
  "Sleep C+": "Attack",
  SteadyHand: "Multi Skill",
  "Talisman Boost": "Item",
};

const retrieveSkills = async () => {
  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);

  const rows = $("table.wikitable > tbody > tr");

  rows.each((index, element) => {
    if (index === 0) return; // Skip header row

    const rowSpan = $(element).find("td[rowspan]").attr("rowspan");

    const skillTree = $(element).find("td > h3 > span").text().trim();

    const skillValues = [];

    for (let i = 0; i < rowSpan; i++) {
      const element = rows.eq(index + i);
      let name;
      let level;
      let description;
      if (i == 0) {
        name = $(element)
          .find("td:nth-child(2)")
          .html()
          .split("<br>")[0]
          .replace(/<[^>]*>/g, "")
          .trim();

        level = Number($(element).find("td:nth-child(3)").text().trim());
        description = $(element).find("td:nth-child(4)").text().trim();
      } else {
        name = $(element)
          .find("td:nth-child(1)")
          .html()
          .split("<br>")[0]
          .replace(/<[^>]*>/g, "")
          .trim();
        level = Number($(element).find("td:nth-child(2)").text().trim());
        description = $(element).find("td:nth-child(3)").text().trim();
      }
      skillValues.push({ name, level, description });
    }

    console.log("SKILL VALUES:", skillValues);

    // console.log("SKILL TREE:", skillTree);

    // console.log("SKILL NAME:", skillName);

    // console.log(
    //   "SKILL TREE:",
    //   skillTree,
    //   "SKILL NAME:",
    //   skillName,
    //   "SKILL VALUES:",
    //   skillValues
    // );
    if (skillTree) {
      retrievedSkills.push({
        skillTree,
        type: skillCategoryMap[skillTree] ?? "temp",
        details: skillValues,
      });
    }

    // $("td > h3 > span").each((i, el) => {
    //   const skillName = $(el).text().trim();
    //   console.log("SKILL NAME:", skillName);
    //   // retrievedSkills.push(skillName);
    // });
  });
  // console.log("RETRIEVED SKILLS:", retrievedSkills);
};

(async () => {
  await retrieveSkills();
  fs.writeFile(
    "output/skillTree.json",
    JSON.stringify(retrievedSkills, null, 1),
    (err) => {
      if (err) throw err;
      console.log("File successfully saved!");
    },
  );
})();
