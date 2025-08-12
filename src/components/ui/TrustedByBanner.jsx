/* eslint-disable react/prop-types */

const TrustedByBanner = ({ header, images, bgColor }) => {
  return (
    <div className="w-full py-8 px-4">
      {header && (
        <h2 className="text-center text-2xl font-semibold mb-6">
          {header}
        </h2>
      )}

      <div
        className={`w-full flex flex-wrap justify-center items-center gap-6 ${
          bgColor || "bg-white"
        }`}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="flex justify-center items-center w-28 h-40"
          >
            <img
              src={img.src}
              alt={img.alt || `trusted-by-${index}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedByBanner;
