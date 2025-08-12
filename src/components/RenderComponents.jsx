/* eslint-disable react/prop-types */
import { FiChevronDown } from "react-icons/fi";
import {
  extractGeneralFeedback,
  parseScoreBreakdown,
} from "./modals/UIUtilities";
import { CardFormattedText } from "./ui/Card";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RenderFeedback = ({ feedback }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!feedback) return null;

  if (typeof feedback === "object") {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Feedback</h3>
        <div className="p-4 border border-transparent rounded bg-gray-50">
          <table className="w-full">
            <tbody>
              {Object.entries(feedback).map(([key, value]) => (
                <tr key={key} className="border-b last:border-b-0">
                  <td className="py-2 pr-4 font-medium">{key}:</td>
                  <td className="py-2">
                    <CardFormattedText text={value} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const scoreBreakdown = parseScoreBreakdown(feedback);
  let generalFeedback = extractGeneralFeedback(feedback);

  return (
    <div className="mt-6">
      <div className="w-full">
        <div className="mb-1">
          <div className="w-full flex items-center font-semibold justify-between">
            Rubric Breakdown and Feedback
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-neutral-ghost hover:bg-text-placeholder"
            >
              <FiChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180 transform" : ""
                }`}
              />
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{
                duration: 0.3,
                ease: [0.04, 0.62, 0.23, 0.98],
              }}
            >
              <div className="bg-gray-50 rounded-lg">
                <div className="p-4">
                  <ReactMarkdown>{generalFeedback}</ReactMarkdown>
                </div>

                {scoreBreakdown?.length > 0 && (
                  <div className="overflow-x-auto pt-4 bg-white">
                    <table className="w-full border-collapse border-none">
                      <thead>
                        <tr>
                          <th className="p-2 text-primary-main text-left">
                            Index
                          </th>
                          <th className="p-2 text-primary-main text-left">
                            Criteria
                          </th>
                          <th className="p-2 text-primary-main text-center">
                            Score
                          </th>
                          <th className="p-2 text-primary-main text-center min-w-[200px]">
                            Max Score for Rubric
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scoreBreakdown.map((criterion, index) => (
                          <tr key={index} className="border-b border-transparent">
                            <td className="p-2 text-neutral-new">
                              {criterion.criterionNumber}
                            </td>
                            <td className="p-2 text-neutral-new">
                              {criterion.criterionText}
                            </td>
                            <td className="p-2 text-neutral-new text-center">
                              {criterion.scoreObtained}
                            </td>
                            <td className="p-2 text-neutral-new text-center">
                              {criterion.maxScore}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
