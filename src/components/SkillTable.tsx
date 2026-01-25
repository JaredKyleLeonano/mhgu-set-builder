import useSkillRows from "./Hooks/UseSkillRows";

const SkillTable = () => {
  const { skillRows, activatedCount } = useSkillRows();
  return (
    <div className="flex flex-col flex-3">
      <div className="flex flex-col flex-1">
        <h4 className="w-full text-xl px-2 py-1 rounded-t-xl bg-[#6a3237] text-[#d4a553]">
          Skill Details
        </h4>
        <div
          className={`flex flex-col items-start text-base flex-[0px] overflow-auto p-2 rounded-b-lg transition-all duration-800 ease-out bg-[#C4B793] border-[#a86f39] focus:outline-none focus:ring-0`}
        >
          <table className="w-full text-center table-auto">
            <thead className="bg-[#3A2623] text-gray-200 [&_th]:border-2 [&_th]:border-black [&_th]:p-1 ">
              <tr>
                <th className="">Skill Tree</th>
                <th>Head</th>
                <th>Torso</th>
                <th>Arms</th>
                <th>Waist</th>
                <th>Legs</th>
                <th>Sum</th>
                <th>Active Skills</th>
              </tr>
            </thead>
            <tbody className="[&_td]:p-1">
              {[
                ...skillRows,
                ...(skillRows.length >= 10
                  ? Array(1).fill(Array(8).fill(""))
                  : (Array(10 - skillRows.length).fill(Array(8).fill("")) as (
                      | string
                      | number
                    )[][])),
              ].map((rows, i) => {
                return (
                  <tr
                    className={`h-8
                                    ${
                                      i % 2 === 0
                                        ? "bg-[#B0A37A]"
                                        : "bg-[#C2B494]"
                                    }`}
                    key={`row_${i}`}
                  >
                    {rows.map((column: string, j: number) => (
                      <td
                        className={`border-2   ${
                          activatedCount == i + 1 &&
                          activatedCount != 0 &&
                          skillRows.length > 1 &&
                          j != 0
                            ? " border-b-amber-300 border-t-black border-l-black border-r-black"
                            : "border-black"
                        }`}
                        key={`column_${i}+${j}`}
                      >
                        {column}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillTable;
