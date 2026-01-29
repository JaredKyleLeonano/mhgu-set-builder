import { useAppContext } from "./Hooks/UseAppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import OverallStats from "./OverallStats";
import SkillTable from "./SkillTable";

const ArmorDetails = () => {
  const { selectedArmor, setViewEquipment, setShowBackground } =
    useAppContext();
  return (
    <div className="flex-3 flex flex-col ">
      <div className="flex justify-between font-inter text-sm md:text-2xl lg:text-2xl px-2 py-1 rounded-t-xl bg-[#3A2623] text-white [-webkit-text-stroke:3px#000] [paint-order:stroke_fill]">
        <h4>Set Details</h4>
        <div className="flex items-center lg:hidden">
          <img
            className={`${selectedArmor.Head ? "opacity-100" : "opacity-40"} transition-opacity duration-200 ease-out h-5 w-5 md:h-6 md:w-6`}
            src="assets/images/Head_1.webp"
          ></img>
          <img
            className={`${selectedArmor.Torso ? "opacity-100" : "opacity-40"} transition-opacity duration-200 ease-out h-5 w-5 md:h-6 md:w-6`}
            src="assets/images/Torso_1.webp"
          ></img>
          <img
            className={`${selectedArmor.Arms ? "opacity-100" : "opacity-40"} transition-opacity duration-200 ease-out h-5 w-5 md:h-6 md:w-6`}
            src="assets/images/Arms_1.webp"
          ></img>
          <img
            className={`${selectedArmor.Waist ? "opacity-100" : "opacity-40"} transition-opacity duration-200 ease-out h-5 w-5 md:h-6 md:w-6`}
            src="assets/images/Waist_1.webp"
          ></img>
          <img
            className={`${selectedArmor.Legs ? "opacity-100" : "opacity-40"} transition-opacity duration-200 ease-out h-5 w-5 md:h-6 md:w-6`}
            src="assets/images/Legs_1.webp"
          ></img>
        </div>
        <button
          onClick={() => {
            setViewEquipment(true);
            setShowBackground(true);
          }}
          className="lg:hidden flex items-center gap-1 md:gap-2 cursor-pointer"
        >
          <p>View Equipment</p>
          <FontAwesomeIcon
            className="text-xs md:text-xl"
            icon={faInbox}
          ></FontAwesomeIcon>
        </button>
      </div>
      <div className="flex-1 h-full flex flex-row lg:flex-col gap-2 lg:gap-4 font-inter bg-black/70 p-1 lg:py-2 lg:px-4">
        <OverallStats></OverallStats>
        <SkillTable></SkillTable>
      </div>
    </div>
  );
};

export default ArmorDetails;
