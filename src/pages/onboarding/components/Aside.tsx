import Logo from "../../../components/ui/Logo.tsx";

const Aside = () => {
  return (
    <div className="mlg:w-[47.6vw] mlg:h-screen mlg:min-h-[580px] mlg:max-h-screen bg-[#F7F9FC] p-12 lgd:p-25 mlg:pb-[10vh] flex flex-col justify-between mlg:sticky top-0 left-0">
      <Logo />

      <div className="hidden font-dmsans mlg:flex flex-col w-fit gap-4">
        <p className="text-blue-5 font-bold text-2xl mlg:text-[2.5rem] mlg:leading-[52px]">
          We use AI to personalize your learning experience.
        </p>
        
        <p className="text-blue-6 leading-[31px]">
          Let's build your learning path.
        </p>
      </div>
    </div>
  );
};

export default Aside;
