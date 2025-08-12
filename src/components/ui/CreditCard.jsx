/* eslint-disable react/prop-types */
const InfoCard = ({ icon, header, description }) => {
  const isImage = typeof icon === "string"; // if icon is a string, treat it as an image URL

  return (
    <div className="p-6 item rounded-2xl bg-[#DDEFF9] shadow hover:shadow-md transition w-full h-32 max-w-md">
      <div className="flex items-start space-x-4">
        <div className="text-green-700 text-3xl">
          {isImage ? (
            <img src={icon} alt="icon" className="w-8 h-8 object-contain" />
          ) : (
            icon && <icon.type {...icon.props} />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{header}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
