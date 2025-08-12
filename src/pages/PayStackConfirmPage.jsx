import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { setShowPurchaseCreditDialog } from "../features/reducers/uiSlice";
import { fetchUserCredits } from "../features/reducers/userSlice";
import { useSelector } from "react-redux";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userCredits, getCreditsLoading } = useSelector(
    (state) => state.users
  );

  const [paymentStatus, setPaymentStatus] = useState("verifying"); // 'verifying', 'success', 'failed', 'cancelled'
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");
  const [creditsRefreshed, setCreditsRefreshed] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");
        const trxref = searchParams.get("trxref");

        const storedReference = localStorage.getItem("paystack_reference");
        const selectedPlan = localStorage.getItem("selected_plan");
        const selectedPlanAmount = localStorage.getItem("selected_plan_amount");
        const selectedPlanCost = localStorage.getItem("selected_plan_cost");

        const localPresent =
          storedReference &&
          selectedPlan &&
          selectedPlanAmount &&
          selectedPlanCost;

        if (!localPresent) {
          navigate("/dashboard");
        }

        if (searchParams.get("cancelled") === "true") {
          setPaymentStatus("cancelled");
          return;
        }

        const paymentReference = reference || trxref || storedReference;

        if (!paymentReference) {
          setPaymentStatus("failed");
          setError("Payment reference not found");
          return;
        }

        const creditsProcessed = localStorage.getItem(
          `credits_processed_${paymentReference}`
        );

        if (!creditsProcessed) {
          try {
            await dispatch(fetchUserCredits()).unwrap();
            setCreditsRefreshed(true);
            localStorage.setItem(
              `credits_processed_${paymentReference}`,
              "true"
            );
          } catch (fetchError) {
            console.error("Error fetching updated credits:", fetchError);
          }
        } else {
          setCreditsRefreshed(true);
        }

        setPaymentStatus("success");
        setPaymentDetails({
          plan: selectedPlan,
          reference: paymentReference,
          credits: selectedPlanAmount,
          amount: selectedPlanCost,
        });

        localStorage.removeItem("paystack_reference");
        localStorage.removeItem("selected_plan");
        localStorage.removeItem("selected_plan_amount");
        localStorage.removeItem("selected_plan_cost");
      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus("failed");
        setError("Network error occurred during verification");
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleRetry = () => {
    const keysToRemove = [
      "paystack_reference",
      "selected_plan",
      "selected_plan_amount",
      "selected_plan_cost",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("credits_processed_")) {
        localStorage.removeItem(key);
      }
    });

    navigate("/dashboard");
    dispatch(setShowPurchaseCreditDialog(true));
  };

  const refreshCredits = async () => {
    try {
      await dispatch(fetchUserCredits()).unwrap();
      setCreditsRefreshed(true);
    } catch (error) {
      console.error("Error refreshing credits:", error);
    }
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your payment and update your
              credits...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your credits have been added to your
              account.
            </p>

            {paymentDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-green-800 mb-2">
                  Payment Details:
                </h3>
                <div className="space-y-1 text-sm text-green-700">
                  <p>
                    <span className="font-medium">Plan:</span>{" "}
                    {paymentDetails.plan}
                  </p>
                  <p>
                    <span className="font-medium">Credits Added:</span>{" "}
                    {paymentDetails.credits}
                  </p>
                  <p>
                    <span className="font-medium">Amount Paid:</span> ₦
                    {paymentDetails.amount?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Reference:</span>{" "}
                    {paymentDetails.reference}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  Current Balance:
                </span>
                <div className="flex items-center gap-2">
                  {getCreditsLoading ? (
                    <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <span className="text-blue-900 font-bold">
                      {userCredits !== null
                        ? `${userCredits} credits`
                        : "Loading..."}
                    </span>
                  )}
                  {!creditsRefreshed && (
                    <button
                      onClick={refreshCredits}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                      disabled={getCreditsLoading}
                    >
                      Refresh
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        );

      case "failed":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't process your payment. Please try again.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-primary-main text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      case "cancelled":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <XCircle className="w-16 h-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h2>
            <p className="text-gray-600 mb-6">
              You cancelled the payment process. No charges were made.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-primary-main text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderContent()}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Having issues?{" "}
            <a
              href="mailto:info@acadai.co"
              className="text-primary-main hover:text-blue-800 underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
