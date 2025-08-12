/* eslint-disable react/prop-types */

import CustomButton from "./Button";

const PricingCard = ({
  header,
  description,
  price,
  pricePerCredit,
  features,
  getStartedLink,
  tag,
}) => {
  return (
    <div className="relative pt-8 pb-6 px-4 rounded-2xl bg-white border border-[#EEEEEE] shadow-sm hover:shadow-md transition w-full max-w-sm">
      {tag && (
        <div className="absolute -top-3 left-56 transform -translate-x-1/2 bg-[#155EEF] text-white text-xs font-semibold px-4 py-2 rounded-full shadow">
          {tag}
        </div>
      )}

      <h3 className="text-3xl font-bold text-gray-800 mb-1 ">{header}</h3>
      <p className="text-gray-600 mb-7 text-sm">{description}</p>

      <div className=" mb-1 text-4xl font-bold ">₦{price}</div>
      <p className="text-sm text-[#155EEF] mb-6">
        ₦{pricePerCredit} per credit
      </p>

      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <img src="/list-check.svg" alt="" className="w-5 h-5" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <CustomButton
        as="link"
        to={getStartedLink}
        className="block text-center bg-transparent !text-[#1836B2] hover:!text-white px-5 py-2 rounded-lg text-sm font-medium "
      >
        Get Started
      </CustomButton>
    </div>
  );
};

export default PricingCard;
