/* eslint-disable react/prop-types */
import { useState } from "react";

export default function StepperSection({ sectionTitle, sectionDescription, steps }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full m-6 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{sectionTitle}</h2>
        <p className="text-gray-700">{sectionDescription}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        <div className="relative w-full">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <ul className="space-y-8">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <li
                  key={index}
                  className="relative flex items-start gap-4 cursor-pointer"
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      isActive ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold mb-1 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isActive ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-center w-full">
          <img
            src={steps[activeStep].image}
            alt={steps[activeStep].title}
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
