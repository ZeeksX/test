import { useState, useEffect, useCallback } from "react";
import { PiCaretLeft } from "react-icons/pi";
import { cn } from "../../utils/classNames";
import { EdugistLogo, featuredIn1 } from "../../utils/images";
import CustomButton from "../ui/Button";
import { MdArrowOutward } from "react-icons/md";

const items = [
  {
    title:
      "How Africa’s first AI grading engine emerged from a Nigerian undergraduate Anjolaoluwa Ajayi’s research project.",
    description:
      "When Anjolaoluwa Ajayi, the founder of ACAD AI, received a 91% score on her undergraduate research project, it wasn’t just a personal achievement—it marked",
    image: featuredIn1,
    color: "bg-primary-vividBlueBg",
    textColor: "text-primary-main",
    icon: EdugistLogo,
  },
  {
    title:
      "How Africa’s first AI grading engine emerged from a Nigerian undergraduate Anjolaoluwa Ajayi’s research project.",
    description:
      "When Anjolaoluwa Ajayi, the founder of ACAD AI, received a 91% score on her undergraduate research project, it wasn’t just a personal achievement—it marked",
    image: featuredIn1,
    color: "bg-secondary-mutedPurpleBg",
    textColor: "text-primary-main",
    icon: EdugistLogo,
  },
  {
    title:
      "How Africa’s first AI grading engine emerged from a Nigerian undergraduate Anjolaoluwa Ajayi’s research project.",
    description:
      "When Anjolaoluwa Ajayi, the founder of ACAD AI, received a 91% score on her undergraduate research project, it wasn’t just a personal achievement—it marked",
    image: featuredIn1,
    color: "bg-primary-energeticYellowBg",
    textColor: "text-primary-main",
    icon: EdugistLogo,
  },
];

const FeaturedIn = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, goToNext]);

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, currentIndex]
  );

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();

    setTouchStart(null);
    setTouchEnd(null);
  };
  return (
    <div className="w-full px-[5%] flex flex-col py-[50px]">
      <div className="space-y-2">
        <h3 className="text-primary-main text-[28px] sm:text-[32px] font-medium leading-10">
          Featured In
        </h3>
        <p className="text-gray-600 text-sm">Lorem ipsum.</p>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className="relative w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div
                  className={`flex flex-col lg:flex-row items-center gap-8 p-4`}
                >
                  <div className="w-full lg:w-1/2 relative">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden flex items-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                    <img
                      src={item.icon || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover mb-6"
                    />
                    <h3
                      className={cn(
                        "text-2xl font-medium mb-4",
                        item.textColor
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-light mb-4">
                      {item.description}
                    </p>
                    <p className="text-sm text-neutral-light mb-4">
                      by{" "}
                      <span className="text-base text-black">Akeem Alao</span> |
                      July 24, 2025
                    </p>
                    <CustomButton
                      variant="link"
                      className="font-medium !p-0 !justify-start flex !no-underline"
                    >
                      Read blog <MdArrowOutward size={24} />
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={goToPrevious}
          className="absolute right-16 top-[30px] -translate-y-1/2 bg-primary-main hover:bg-primary-main/80 text-white p-2 rounded-full shadow-md z-10"
          aria-label="Previous slide"
        >
          <PiCaretLeft className="h-6 w-6 text-neutral-darkCharcoal" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-[30px] -translate-y-1/2 bg-primary-main hover:bg-primary-main/80 text-white p-2 rounded-full shadow-md z-10"
          aria-label="Next slide"
        >
          <PiCaretLeft className="h-6 w-6 text-neutral-darkCharcoal rotate-180" />
        </button>

        <div className="flex justify-center mt-8 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-primary-vividBlue w-8"
                  : "bg-neutral-mediumGray hover:bg-neutral-mediumGray/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedIn;
