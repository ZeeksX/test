export const ReadyToGradeBanner = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center py-10 md:px-20 px-5 space-y-5 w-full overflow-hidden"
      style={{ backgroundColor: "#1836B2" }}
    >
        
      <img
        src="/pattern/gradePattern.svg"
        alt="Left Pattern"
        className="md:absolute hidden left-0 top-0 h-full object-cover pointer-events-none"
      />


      <img
        src="/pattern/gradePattern.svg"
        alt="Right Pattern"
        className="absolute right-0 top-0 h-full object-cover pointer-events-none"
      />

      <div className=" space-y-5 p-5 bg-white rounded-lg shadow-lg w-full">
  
  
        <p className="font-bold text-4xl md:text-6xl text-[#454545] ">
          Ready to Grade Faster and Smarter?
        </p>


        <p className="text-[#454545]">
          Join educators using Acad AI to save hours, give better feedback, and
          focus on what really matters – teaching.
        </p>


        <div className="flex flex-wrap justify-center gap-5">
          <button className="bg-[#1836B2] text-white px-6 py-3 rounded-lg font-semibold">
            Get started for Free
          </button>
          <button className="text-[#1836B2] border border-[#1836B2] px-6 py-3 rounded-lg font-semibold">
            Send me updates
          </button>
        </div>
      </div>
    </div>
  );
};
