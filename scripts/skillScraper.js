import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://monsterhunter.fandom.com/wiki/MHGU:_Skill_List";

const retrievedSkills = [];

const retrieveSkills = async () => {
  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);

  const rows = $("table.wikitable > tbody > tr");

  rows.each((index, element) => {
    if (index === 0) return; // Skip header row

    const rowSpan = $(element).find("td[rowspan]").attr("rowspan");

    const skillTree = $(element).find("td > h3 > span").text().trim();

    const skillName = [];
    const values = [];
    const skillValues = [];

    for (let i = 0; i < rowSpan; i++) {
      const element = rows.eq(index + i);
      let skillName;
      let value;
      if (i == 0) {
        skillName = $(element)
          .find("td:nth-child(2)")
          .html()
          .split("<br>")[0]
          .replace(/<[^>]*>/g, "")
          .trim();

        value = Number($(element).find("td:nth-child(3)").text().trim());
      } else {
        skillName = $(element)
          .find("td:nth-child(1)")
          .html()
          .split("<br>")[0]
          .replace(/<[^>]*>/g, "")
          .trim();
        value = Number($(element).find("td:nth-child(2)").text().trim());
      }
      skillValues.push({ skillName, value });
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
    }
  );
})();
