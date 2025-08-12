import { Switch } from "./ui/Switch";

const Settings = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[583px]">
        {" "}
        {/* Match card width */}
        {/* Header section */}
        <div className="mt-8 flex flex-col gap-4">
          <h1 className="text-[32px] leading-8 font-medium">Settings</h1>
          <p className="text-[#A1A1A1] text-sm font-normal">
            Manage your notification preferences
          </p>
        </div>
        {/* Card container */}
        <div className="py-8 px-5 h-[244px] rounded-[10px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] mt-5">
          <div className="w-full space-y-8">
            {/* Push Notification Section */}
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1">
                <h1 className="text-sm font-medium text-[#222222] leading-5">
                  Push Notification
                </h1>
                <p className="text-sm font-normal text-[#A1A1A1] max-w-[400px]">
                  Get instant updates on your device about examination, results,
                  reminders, and important app alerts.
                </p>
              </div>
              <Switch checked={false} />
            </div>

            {/* Email Notification Section */}
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1">
                <h1 className="text-sm font-medium text-[#222222] leading-5">
                  Email Notification
                </h1>
                <p className="text-sm font-normal text-[#A1A1A1] max-w-[400px]">
                  Receive updates, results, and announcements directly to your
                  email inbox.
                </p>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
