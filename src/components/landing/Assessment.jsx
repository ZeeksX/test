import { Card, CardContent } from "../ui/Card";
import { RadioGroup, RadioGroupItem } from "../ui/Radio";
import { Label } from "../ui/Label";

const Assessment = () => {
  return (
    <div className="w-full mx-auto px-[5%] py-[60px] space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h3 className="text-primary-main text-[28px] sm:text-[32px] font-medium leading-10">
          Acad AI Helps You Grade
        </h3>
        <p className="text-gray-600 text-sm">
          Lorem ipsum dolor sit amet consectetur. Sit a in rhoncus vestibulum ut
          sagittis mollis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 gap-4 flex flex-col">
          <div>
            <h4 className="text-xl font-normal text-gray-800">Theory</h4>
          </div>
          <CardContent className="space-y-4 !p-0">
            <div>
              <p className="text-sm text-neutral-light mb-2">Question</p>
              <p className="text-gray-800 text-sm">
                What does Acad AI{" "}
                <span className="text-primary-main font-medium">do</span>?
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-light mb-2">Answer</p>
              <p className="text-gray-700 leading-relaxed text-[15px]">
                Acad AI automates grading{" "}
                <span className="text-primary-main font-medium">for</span>{" "}
                various <br /> questions types, provides feedback,{" "}
                <span className="text-primary-main font-medium">and</span> saves
                teachers time.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 gap-4 flex flex-col">
          <div>
            <h4 className="text-xl font-normal text-gray-800">
              Multi Choice Question
            </h4>
          </div>
          <CardContent className="space-y-4 !p-0">
            <div>
              <p className="text-sm text-neutral-light mb-2">Question</p>
              <p className="text-gray-800 text-sm">
                Acad AI solves{" "}
                <span className="text-primary-main font-medium">which</span>{" "}
                Sustainable Development Goal (SDG)?
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-light mb-3">Answer</p>
              <RadioGroup defaultValue="sdg3" className="space-y-[1.5]">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sdg2"
                    id="sdg2"
                    className="text-primary-main"
                  />
                  <Label htmlFor="sdg2" className="text-gray-700">
                    SDG 2 - Zero Hunger
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sdg3"
                    id="sdg3"
                    className="text-primary-main"
                  />
                  <Label htmlFor="sdg3" className="text-green-600 font-medium">
                    SDG 3 - Good Health & Well-being
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sdg7"
                    id="sdg7"
                    className="text-primary-main"
                  />
                  <Label htmlFor="sdg7" className="text-gray-700">
                    SDG 7 - Affordable Energy
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 gap-4 flex flex-col">
          <div>
            <h4 className="text-xl font-normal text-gray-800">
              Fill in the Gap
            </h4>
          </div>
          <CardContent className="space-y-4 !p-0">
            <div>
              <p className="text-sm text-neutral-light mb-2">Question</p>
              <p className="text-gray-800 text-sm">
                Acad AI helps _____________ exams faster.
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-light mb-3">Answer</p>
              <RadioGroup defaultValue="grade" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="grade"
                    id="grade"
                    className="text-primary-main"
                  />
                  <Label
                    htmlFor="grade"
                    className="!text-green-500 font-medium"
                  >
                    Grade
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
