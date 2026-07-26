import TeamMember from "../../components/ui/landing/TeamMember";
import { teamMembers } from "./data";

const TheTeam = () => {
  return (
    <section className="mb-12">
      <div className="flex flex-col items-center text-center gap-6 mb-10">
        <h3 className="text-blue-4 font-semibold text-[36px]">Meet the Team</h3>
        <p className="text-purple-2 text-xl leading-[30px] max-w-[850px]">
          Built by Educators, Engineers & AI Experts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 justify-between mx-12">
        {teamMembers.map((member) => {
          const { x, linkedin, role, job, name, img } = member;
          return (
            <TeamMember
              linkedin={linkedin}
              name={name}
              job={job}
              role={role}
              x={x}
            >
              <img
                src={img}
                alt={name}
                className="w-full aspect-square rounded-full  mx-auto object-contain bg-white object-bottom"
              />
            </TeamMember>
          );
        })}
      </div>
    </section>
  );
};

export default TheTeam;
