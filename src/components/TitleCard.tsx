const TitleCard = () => {
  return (
    <div className="relative flex z-10 m-2 w-full justify-center">
      <div className="h-full w-6 border-l-3 border-r-4 bg-linear-to-b from-[#5a3a2f] to-[#3a2623] border-[#e6c98f]/50"></div>
      <div className="relative flex justify-center border-t-2 border-b-2 border-[#e6c98f]/50 gap-2 py-2 px-6 bg-linear-to-b from-[#5a3a2f] to-[#3a2623] ">
        <h1 className="text-6xl font-cinzel font-bold tracking-wide bg-linear-to-b from-[#d9b88f] to-[#8c5a2b] bg-clip-text text-transparent">
          MHGU SET BUILDER
        </h1>
        <img
          className="h-12 rotate-10 "
          src="assets/images/palicoLogo.png"
        ></img>
      </div>
      <div className="h-full w-6 border-l-4 border-r-3 bg-linear-to-b from-[#5a3a2f] to-[#3a2623] border-[#e6c98f]/50"></div>
    </div>
  );
};

export default TitleCard;
