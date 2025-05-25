import { Input } from "./ui/Input";
import CustomButton from "./ui/Button";
import { GoArrowUpRight } from "react-icons/go";
import { useState } from "react";
import Toast from "./modals/Toast";
import apiCall from "../utils/apiCall";
import { faceb, postal_img, insta, link, twit, yout } from "../utils/images";


const CTASection = () => {
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [suggestionSending, setSuggestionSending] = useState(false);
  const [sending, setSending] = useState(false);
  const [showForm, setShowFrom] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const submitEmail = async (e) => {
    e.preventDefault();
    setSending(true);

    const body = { email };

    try {
      const response = await apiCall.post("/newsletter/beta/", body);

      if (response.status === 200) {
        showToast("Thank you for joining our beta-waitlist", "success");
        setEmail("");
      }
    } catch (error) {
      if (error.status === 400) {
        showToast(
          "Beta-waitlist signup with this email already exists.",
          "error"
        );
        console.error("Error submitting student email:", error);
      } else {
        showToast("Failed to submit email. Please try again.", "error");
        console.error("Error submitting student email:", error);
      }
    } finally {
      setSending(false);
    }
  };

  const submitSuggestion = async (e) => {
    e.preventDefault();
    setSuggestionSending(true);

    const body = { message: suggestions };

    try {
      const response = await apiCall.post("/newsletter/suggestion/", body);

      if (response.status === 200) {
        showToast("Thank you for your suggestion", "success");
        setSuggestions("");
        setShowFrom(false);
      }
    } catch (error) {
      if (error.status === 400) {
        // showToast("Newsletter signup with this email already exists.", "error");
        showToast("Failed to post suggestion. Please try again.", "error");
        console.error("Error posting suggestion:", error);
      } else {
        showToast("Failed to post suggestion. Please try again.", "error");
        console.error("Error posting suggestion:", error);
      }
    } finally {
      setSuggestionSending(false);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <section
      id="beta-waitlist"
      className="relative w-full flex items-center justify-center"
    >
      <div className="p-8 flex flex-col w-max items-center">
        <h3 className="font-metropolis font-bold text-[19.61px] md:text-[40px] leading-[100%] text-center max-w-[600px]">
          Be Among the First: <br /> Join the Acad AI Teacher Beta
        </h3>
        <p className="text-xs text-center md:text-2xl mt-4">
          Get Early Access & Help Shape the Future of Teaching with AI
        </p>
        <form
          className="w-full md:max-w-[60%] mt-4 md:mt-8 flex items-center flex-col"
          onSubmit={submitEmail}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=""
            required
            placeholder="Enter your email here"
          />
          <CustomButton
            type="submit"
            className="min-w-[170px] !min-h-11 !py-3 gap-1 !font-normal !rounded-[14px] md:mt-8 mt-4"
            loading={sending}
          >
            Join Beta Waitlist <GoArrowUpRight size={20} />
          </CustomButton>
        </form>
      </div>
      <div className="absolute bottom-0 right-[20px]">
        <div
          className="rounded-full p-4 shadow-xl cursor-pointer"
          onClick={() => setShowFrom(!showForm)}
        >
          <img src={postal_img} alt="" className="md:w-14 w-10" />
        </div>
        {showForm && (
          <form
            onSubmit={submitSuggestion}
            className="absolute right-0 top-[calc(100%_+_10px)] rounded-md bg-white p-2 shadow-navShadow"
          >
            <textarea
              className="max-w-[400px] w-[80dvw] h-[200px] p-2 border-b outline-none resize-none bg-gray-50 focus:outline-none focus:border-primary-main"
              placeholder="Please share your suggestions here"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              name=""
              id=""
            />
            <CustomButton
              type="submit"
              className="w-full !min-h-11 !py-3 gap-1 !font-normal !rounded-[8px]"
              loading={suggestionSending}
            >
              Post
            </CustomButton>
          </form>
        )}
      </div>

      {/* <div className="flex opacity-0 cursor-pointer">
        <img src={insta} width="24" height="24" alt="Facebook" />
        <img src={link} width="24" height="24" alt="Facebook" />
        <img src={twit} width="24" height="24" alt="Facebook" />
        <img src={yout} width="24" height="24" alt="Facebook" />
        <img src={faceb} width="24" height="24" alt="Facebook" />
      </div> */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </section>
  );
};

export default CTASection;
