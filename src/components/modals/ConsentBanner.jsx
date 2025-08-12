import { useEffect, useState } from "react";

const ConsentBanner = () => {
  const [consent, setConsent] = useState(localStorage.getItem("ga_consent"));

  useEffect(() => {
    if (consent === "accepted") {
      loadGA();
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

  const loadGA = () => {
    // Add GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-045J2PF48F';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-045J2PF48F');
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