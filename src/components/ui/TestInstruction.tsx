const TestInstruction: React.FC<any> = ({ children, numberOfQuestions }) => (
  <div className="flex items-start gap-4 bg-violet-50/50 border-2 border-violet-100 p-4 rounded-2xl flex-col ">
    <p className="text-sm font-bold text-violet-600">
      Question 1 - {numberOfQuestions}
    </p>
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex w-12 h-12 bg-white rounded-xl items-center justify-center text-violet-600 shadow-sm border border-violet-100 shrink-0">
        <span className="font-bold text-xs">TIP</span>
      </div>
      <p className="text-sm font-medium text-violet-800 leading-snug">
        {children}
      </p>
    </div>
  </div>
);

export default TestInstruction;
