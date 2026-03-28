import logo from "../../assets/images/Logo.png";

const Logo = () => {
  return (
    <div className="flex items-center w-fit md:ml-3 mlg:justify-between mlg:ml-5 md:gap-6">
      <img src={logo} alt="LEARNEXO" className="w-full h-full" />
      <span className="font-inter text-blue-3 font-bold text-3xl mlg:text-4xl">
        LearNEXO
      </span>
    </div>
  );
};

export default Logo;
