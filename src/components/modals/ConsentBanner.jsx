import { useEffect, useState } from "react";

const ConsentBanner = () => {
  const [consent, setConsent] = useState(localStorage.getItem("ga_consent"));

  useEffect(() => {
    if (consent === "accepted") {
      loadGTM();
    }
  }, [consent]);

  const handleAccept = () => {
    localStorage.setItem("ga_consent", "accepted");
    setConsent("accepted");
  };

  const handleReject = () => {
    localStorage.setItem("ga_consent", "rejected");
    setConsent("rejected");
  };

  const loadGTM = () => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtm.js?id=GT-MQXVVVMB";
    script.async = true;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=GT-MQXVVVMB"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);
  };

  if (consent) return null;

  return (
    <div className="fixed bottom-0 max-w-[100vw] bg-primary-main text-white p-4 flex justify-between items-center z-[1000]">
      <p className="mr-8 text-sm md:text-base">We use cookies for analytics. Do you consent?</p>
      <div className="flex gap-6">
        <button className="px-4 py-1 border border-white hover:bg-white hover:text-primary-main" onClick={handleAccept}>Accept</button>
        <button className="px-4 py-1 border border-white hover:bg-white hover:text-primary-main" onClick={handleReject}>Reject</button>
      </div>
    </div>
  );
};

export default ConsentBanner;
