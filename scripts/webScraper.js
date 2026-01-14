import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const baseLink = "https://monsterhunter.fandom.com";

const majorUrls = [
  "https://monsterhunter.fandom.com/wiki/MHGU:_Low_Rank_Blademaster_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_Low_Rank_Gunner_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_High_Rank_Blademaster_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_High_Rank_Gunner_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_G_Rank_Blademaster_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_G_Rank_Gunner_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_Miscellaneous_Armor",
  "https://monsterhunter.fandom.com/wiki/MHGU:_Special_Permit_Armor",
];

const retrievedArmors = [];
const seenArmors = new Set();

const retrieveArmor = async () => {
  for (const url of majorUrls) {
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html);

    const links = $(".mw-content-ltr h3 .mw-headline > a")
      .toArray()
      .map((el) => $(el).attr("href"));

    for (const link of links) {
      const { data: armorHtml } = await axios.get(baseLink + link);
      const $armor = cheerio.load(armorHtml);

      const typeMap = {
        Blademaster: 1,
        Gunner: 2,
        "Blademaster / Gunner": 3,
        Both: 3,
      };
      const type =
        typeMap[
          $armor("table.themebox")
            .first()
            .find("tr:nth-child(2) > td")
            .text()
            .trim()
        ];

      const rarityValue = parseInt(
        $armor("table.themebox")
          .first()
          .find("tr:nth-child(4) > td")
          .text()
          .trim()
          .split(" ")[1]
      );
      const rarity = isNaN(rarityValue) ? 11 : rarityValue;

      const setName = $armor(
        "div.page-header__bottom > div.page-header__title-wrapper > h1 > span.mw-page-title-main"
      )
        .text()
        .trim()
        .replace(/\s*\([^)]*\)/g, "");
      console.log("SET NAME IS:", setName);

      const armorPieces = ["Head", "Torso", "Arms", "Waist", "Legs"];

      const armors = $armor(".linetable:not(.hover) tr")
        .toArray()
        .filter((el, i) => i % 6 !== 0)
        .map((el, i) => {
          return $armor(el)
            .find("td:nth-child(2)")
            .html()
            .split("<br>")[0]
            .trim();
        });

      const defense = [];
      const slots = [];
      const elemRes = [];
      const skills = [[], [], [], [], []];
      $armor("table.themebox")
        .eq(2)
        .find("tr")
        .each((i, tr) => {
          if (i < 3) return;

          const minimumDefense = $armor(tr)
            .find("td:nth-child(2)")
            .text()
            .trim();
          const maximumDefense = $armor(tr)
            .find("td:nth-child(3)")
            .text()
            .trim();

          defense.push({
            min: Number(minimumDefense),
            max: Number(maximumDefense),
          });

          const elemDef = $armor(tr)
            .find("td:nth-child(n+4):nth-child(-n+8)")
            .map((_, td) => $(td).text().trim())
            .get();

          // console.log("ELEM RES:", elemDef);

          elemRes.push({
            fire: Number(elemDef[0]),
            water: Number(elemDef[1]),
            thunder: Number(elemDef[2]),
            ice: Number(elemDef[3]),
            dragon: Number(elemDef[4]),
          });

          const countedSlots = $armor(tr)
            .find("td:nth-child(9)")
            .text()
            .trim()
            .split("")
            .filter((c) => c === "O").length;

          slots.push(countedSlots);
        });

      $armor("table.themetable")
        .first()
        .find("tr")
        .each((i, tr) => {
          if (i === 0) return;
          const skillName = $armor(tr)
            .find("td")
            .first()
            .html()
            .split("<br>")[0]
            .replace(/<[^>]*>/g, "") // strip <b> if present
            .trim();

          $armor(tr)
            .find("td:not(:first-child)")
            .each((j, td) => {
              if (j === 5) return false;
              const skillValue = $armor(td).text().trim();
              if (skillValue === "") return;
              skills[j].push({ name: skillName, level: Number(skillValue) });
            });
        });

      armorPieces.forEach((piece, i) => {
        if (armors[i] === "" || armors[i] === "N/A") return;
        if (seenArmors.has(armors[i])) return;

        const idInitial = `${type} ${armors[i]}`;
        const id = idInitial.replace(/\s+/g, "-").toLowerCase();
        retrievedArmors.push({
          id,
          type,
          armorPiece: piece,
          rarity,
          set: setName,
          armor: armors[i],
          defense: defense[i],
          elemRes: elemRes[i],
          slots: slots[i],
          skills: skills[i],
        });
        seenArmors.add(armors[i]);
      });
    }
  }
};

(async () => {
  await retrieveArmor();
  fs.writeFile(
    "output/armor.json",
    JSON.stringify(retrievedArmors, null, 1),
    (err) => {
      if (err) throw err;
      console.log("File successfully saved!");
    }
  );
})();
