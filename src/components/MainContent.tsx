import EquippedArmor from "./EquippedArmor";
import BuilderContainer from "./BuilderContainer";

const MainContent = () => {
  return (
    <div className="flex flex-1 mb-1 lg:mb-4 lg:ml-4 lg:mr-4 gap-8 z-10">
      <div className="hidden flex-3 lg:flex">
        <EquippedArmor></EquippedArmor>
      </div>
      <BuilderContainer></BuilderContainer>
    </div>
  );
};

export default MainContent;
