import logo from "../../assets/images/Logo-no-bg.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative">
        <div className="absolute inset-0 bg-violet-500 blur-md opacity-0 group-hover:opacity-15 transition-opacity" />
        <img
          src={logo}
          alt="LEARNEXO"
          className="w-10 h-10 mlg:w-12 mlg:h-12 relative z-10"
        />
      </div>
      <span className="font-inter text-blue-3 font-bold text-2xl mlg:text-3xl tracking-tighter">
        Lear<span className="text-purple-1">NEXO</span>
      </span>
    </div>
  );
};

export default Logo;
