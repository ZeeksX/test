const AcadAIInAction = () => {
  /*
    I added the video instead of a template video
    I modified the aspect ratio of the video to me more responsive
    I reduced the fontsize and padding/margin of some of the tags (they were too large)
  */

  return (
    <div className="acad-ai-in-action w-full py-10 px-[5%]">
      <div className="flex flex-col items-center gap-2 text-white">
        <h1 className="text-center text-[40px] max-[280px]:text-2xl font-medium max-md:text-3xl leading-10">
          Acad AI in Action
        </h1>
        <p className="text-sm !font-extralight text-center">
          It’s Easier Than You Think - Watch This
        </p>
      </div>
      <div className="w-full max-w-6xl mx-auto aspect-video mt-10">
        <iframe
          className="w-full h-full rounded-xl"
          src="https://www.youtube.com/embed/9fgKU0lxM64?si=4hUerMzLv-ijVge5"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowfullscreen
          title="YouTube video player"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default AcadAIInAction;
