import EquippedArmor from "./EquippedArmor";
import BuilderContainer from "./BuilderContainer";
import { useAppContext } from "./Hooks/UseAppContext";

const MainContent = () => {
  const { showBackground } = useAppContext();
  return (
    <div className="flex flex-1 mb-1 lg:mb-4 lg:ml-4 lg:mr-4 gap-8 z-10">
      <div
        className={`${showBackground ? "opacity-100 z-40" : "opacity-0 -z-10"} transition-opacity duration-200 ease-out fixed inset-0 h-screen w-screen bg-black/80 lg:hidden`}
      ></div>
      <EquippedArmor></EquippedArmor>
      <BuilderContainer></BuilderContainer>
    </div>
  );
};

export default MainContent;
