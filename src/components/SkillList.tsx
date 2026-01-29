import { useMemo, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { SkillType, SkillTreeMap, SkillTreeType } from "../types";
import type { Dispatch, SetStateAction } from "react";

const SkillList = ({
  allSkills,
  searchFilter,
  selectedSkills,
  setSelectedSkills,
}: {
  allSkills: SkillTreeMap;
  searchFilter: string;
  selectedSkills: Record<string, SkillType>;
  setSelectedSkills: Dispatch<SetStateAction<Record<string, SkillType>>>;
}) => {
  const skillCategoryArray = useMemo(() => {
    return [
      "Survival",
      "Item",
      "Quest",
      "Negate",
      "Parameter Change",
      "Attack",
      "Multi Skill",
    ];
  }, []);

  const [openTabs, setOpentabs] = useState({
    "Selected Skills": true,
    Survival: false,
    Item: false,
    Quest: false,
    Negate: false,
    "Parameter Change": false,
    Attack: false,
    "Multi Skill": false,
  });

  const filterSkills = useMemo(() => {
    console.log("SEARCH FILTER IS:", searchFilter);

    const skillCategoryMap: Record<string, SkillTreeType[]> = {
      Survival: [],
      Item: [],
      Quest: [],
      Negate: [],
      "Parameter Change": [],
      Attack: [],
      "Multi Skill": [],
    };

    Object.entries(allSkills).forEach(([key, value]) => {
      for (const skill of value.details) {
        if (
          skill.level > 0 &&
          (!searchFilter ||
            skill.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            key.toLowerCase().includes(searchFilter.toLowerCase()))
        ) {
          skillCategoryMap[value.type].push({
            skillTree: key,
            type: value.type,
            details: [
              {
                name: skill.name,
                level: skill.level,
                description: skill.description,
              },
            ],
          });
        }
      }
    });

    return skillCategoryMap;
  }, [allSkills, searchFilter]);

  const prevSearchRef = useRef("");
  const prevSelectedSkills = useRef<number>(0);

  useEffect(() => {
    (async () => {
      const prevSearch = prevSearchRef.current;

      if (
        Object.values(selectedSkills).length > 0 &&
        prevSelectedSkills.current == 0
      ) {
        setOpentabs((prev) => ({
          ...prev,
          "Selected Skills": true,
        }));
      }

      if (prevSearch && !searchFilter) {
        setOpentabs((prev) => {
          const next = { ...prev };
          for (const category of skillCategoryArray) {
            if (category == "Selected Skills") break;
            next[category as keyof typeof next] = false;
          }
          return next;
        });
      }

      if (searchFilter) {
        setOpentabs((prev) => {
          const next = { ...prev };
          for (const category of skillCategoryArray) {
            if (category == "Selected Skills") break;
            next[category as keyof typeof next] =
              filterSkills[category].length > 0;
          }
          return next;
        });
      }

      prevSearchRef.current = searchFilter;
      prevSelectedSkills.current = Object.values(selectedSkills).length;
      console.log("FILTERED SKILLS ARE", filterSkills);
    })();
  }, [
    setOpentabs,
    filterSkills,
    searchFilter,
    skillCategoryArray,
    selectedSkills,
  ]);

  return (
    <>
      <div className="flex flex-col text-xs lg:text-base font-inter">
        <div className="relative">
          <button
            onClick={() =>
              setOpentabs((prev) => ({
                ...prev,
                "Selected Skills": !prev["Selected Skills"],
              }))
            }
            className={`flex w-full group rounded-t-2xl cursor-pointer justify-between items-center p-2 transition-colors duration-300 ease-out bg-[#6a3237] text-sm lg:text-xl text-[#d4a553] `}
          >
            Selected Skills
          </button>
          <button
            onClick={() => setSelectedSkills({})}
            className="absolute group top-1/2 -translate-y-1/2 right-2 text-xs lg:text-base font-inter cursor-pointer  transition-all duration-300  text-[#D6C9AD] hover:text-[#FFFBEB] "
          >
            Clear{" "}
            <FontAwesomeIcon
              className="text-[#D6C9AD] group-hover:text-[#FFD700] transition-color duration-300 ease-out"
              icon={faTrash}
            ></FontAwesomeIcon>
          </button>
        </div>
        <div
          className={`grid ${openTabs["Selected Skills"] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all duration-500 overflow-clip bg-[#C4B793]`}
        >
          <div
            className={`flex flex-col min-h-0 text-xs lg:text-base font-inter`}
          >
            {Object.entries(selectedSkills).length > 0 ? (
              <div className="flex flex-col gap-2 p-2">
                {Object.entries(selectedSkills).map(([key, value]) => {
                  console.log("VALUE IS:", value, "KEY IS:", key);
                  return (
                    <div
                      key={`${key}_${value.name}_selected`}
                      className="flex flex-col gap-2"
                    >
                      <label className="flex rounded-2xl transition-all duration-300 ease-out bg-[#D6C9AD] hover:bg-[#cec09e] hover:shadow-sm py-2 px-3 items-center gap-4 ">
                        <input
                          type="checkbox"
                          checked={true}
                          className=""
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSkills((prev) => ({
                                ...prev,
                                [key]: value,
                              }));
                            } else {
                              setSelectedSkills((prev) => {
                                const { [key]: _, ...rest } = prev;
                                console.log(_);
                                return rest;
                              });
                            }
                          }}
                        ></input>
                        <p className="">{value.name}</p>
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-2">
                <label className="flex rounded-2xl bg-[#D6C9AD] py-2 px-3 items-center gap-4 ">
                  <p className="">No Skills Selected</p>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      {skillCategoryArray.map((category, i) => {
        return (
          <div key={`${category}_${i}`} className="flex flex-col">
            <button
              onClick={() =>
                setOpentabs((prev) => ({
                  ...prev,
                  [category]: !prev[category as keyof typeof prev],
                }))
              }
              className={`flex w-full text-xs lg:text-base font-inter cursor-pointer border-t border-b border-[#846e59] justify-between items-center p-2 transition-colors duration-300 ease-out bg-[#C4B793] hover:bg-[#B6A87F]`}
            >
              {category}
              <FontAwesomeIcon
                className={`transition-all duration-300 ${openTabs[category as keyof typeof openTabs] ? "rotate-180" : "rotate-0"}`}
                icon={faCaretDown}
              ></FontAwesomeIcon>
            </button>
            <div
              className={`grid ${openTabs[category as keyof typeof openTabs] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all duration-500 overflow-clip bg-[#C4B793] text-xs lg:text-base font-inter`}
            >
              <div className={`flex flex-col min-h-0`}>
                {filterSkills[category].length > 0 ? (
                  <div className="flex flex-col gap-2 p-2">
                    {Object.values(filterSkills[category]).map(
                      (skillTree, i) => {
                        return (
                          <div
                            key={`${category}_${i}`}
                            className="flex flex-col gap-2"
                          >
                            {skillTree.details.map((skill) => {
                              return (
                                <label
                                  key={skill.name}
                                  className="flex rounded-2xl cursor-pointer transition-all duration-300 ease-out bg-[#D6C9AD] hover:bg-[#cec09e] hover:shadow-sm py-2 px-3 items-center gap-4 "
                                >
                                  <input
                                    type="checkbox"
                                    className=""
                                    checked={
                                      selectedSkills[skillTree.skillTree]
                                        ? selectedSkills[skillTree.skillTree]
                                            .name == skill.name
                                        : false
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedSkills((prev) => ({
                                          ...prev,
                                          [skillTree.skillTree]: skill,
                                        }));
                                      } else {
                                        setSelectedSkills((prev) => {
                                          const {
                                            [skillTree.skillTree]: _,
                                            ...rest
                                          } = prev;
                                          console.log(_);
                                          return rest;
                                        });
                                      }
                                    }}
                                  ></input>
                                  <p className="">{skill.name}</p>
                                </label>
                              );
                            })}
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div className="p-2">
                    <label className="flex rounded-2xl bg-[#D6C9AD] py-2 px-3 items-center gap-4 ">
                      <p className="">No Match</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SkillList;
