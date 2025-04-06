import React from "react";

const VideoSection = () => {
  return (
    <div className="flex items-center justify-center w-4/5 h-96 md:h-[500px] lg:h-[600px] xl:h-[714px] bg-[#D9D9D9] rounded-3xl md:rounded-[45px] overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/g9ZGFaHzcAM?autoplay=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="object-fill w-full h-full"
      />
    </div>
  );
};

export default VideoSection;