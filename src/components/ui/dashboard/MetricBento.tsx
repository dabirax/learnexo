import BentoBox from "./BentoBox";

type MetricBentoProps = {
  topic: string;
  metric?: string;
  info?: string;
};

const MetricBento: React.FC<MetricBentoProps> = ({ topic, metric, info }) => {
  return (
    <BentoBox>
      <div className="flex flex-col gap-4 min-w-50 w-full shrink-0">
        <div className="flex justify-between">
          <p className="capitalize">{topic}</p>
        </div>
        {metric && (
          <p className="font-semibold  text-[30px] leading-[38px]">{metric}</p>
        )}
        {info && <p className="font-semibold leading-[20px] w-4/5">{info}</p>}
      </div>
    </BentoBox>
  );
};

export default MetricBento;
