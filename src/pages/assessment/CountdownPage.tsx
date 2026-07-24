const CountdownPage = ({ countdown }: { countdown: number }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-violet-500/10 blur-[80px] rounded-full scale-150" />
        <div className="relative z-10 w-40 h-40 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl">
          <span className="text-6xl font-extrabold text-white">{countdown}</span>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Get ready...</h2>
        <p className="text-sm text-slate-500">The assessment will begin shortly.</p>
      </div>
    </div>
  );
};

export default CountdownPage;
