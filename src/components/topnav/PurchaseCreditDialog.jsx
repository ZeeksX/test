import { FiCheck } from "react-icons/fi";
import { setShowPurchaseCreditDialog } from "../../features/reducers/uiSlice.jsx";
import { CREDIT_PLANS } from "../../utils/constants.js";
import { Badge } from "../ui/Badge.jsx";
import { CardContent } from "../ui/Card.jsx";
import { CustomBlurBgDialog, DialogContent, OutsideDismissDialog } from "../ui/Dialog.jsx";
import { useSelector } from "react-redux";
import CustomButton from "../ui/Button.jsx";
import { useDispatch } from "react-redux";
import apiCall from "../../utils/apiCall.js";
import { useState } from "react";

export const PurchaseCreditDialog = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.showPurchaseCreditDialog);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const getCreditAmountFromPlan = (planName) => {
    const planCredits = {
      Starter: 20,
      Professional: 50,
      "Power User": 100,
      Expert: 250,
    };
    return planCredits[planName] || 0;
  };

  const handlePaystackSuccess = (reference, planName) => {
    console.log("Payment successful:", reference);

    dispatch(setShowPurchaseCreditDialog(false));

    console.log(`Successfully purchased ${planName} plan!`);
  };

  const handlePaystackClose = () => {
    console.log("Payment dialog closed");
  };

  const handlePlanSelect = async (plan) => {
    setLoadingPlan(plan.name);
    try {
      const creditAmount = plan.amount;

      const body = {
        credits: creditAmount,
      };

      const response = await apiCall.post(`/users/paystack/init/`, body);

      if (response.status == 200) {
        const paymentData = response.data;

        localStorage.setItem("paystack_reference", paymentData.reference);
        localStorage.setItem("selected_plan", plan.name);
        localStorage.setItem("selected_plan_amount", plan.amount);
        localStorage.setItem("selected_plan_cost", plan.cost);

        window.location.href = paymentData.authorization_url;
      } else {
        console.error("Failed to initialize payment:", response);
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <OutsideDismissDialog
      open={isOpen}
      maxWidth="max-content"
      onOpenChange={setShowPurchaseCreditDialog}
    >
      <DialogContent className="max-w-6xl max-h-screen p-5 overflow-y-auto">
        <div className="pb-4 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-center">Choose Your Plan</h1>
          <p className="text-center text-gray-600">
            Select the perfect plan for your teaching needs
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mt-6">
          {CREDIT_PLANS.map((plan, index) => (
            <div
              key={index}
              className="relative border-2 rounded-[16px] hover:border-primary-main/50 transition-colors"
            >
              {plan.badge && (
                <div className="absolute -top-3 right-[40px] transform">
                  <Badge
                    className={`px-3 py-1 text-xs font-medium ${
                      plan.badge === "Recommended"
                        ? "bg-primary-main text-white"
                        : "bg-primary-main text-white"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-primary-main text-sm font-medium">
                    {plan.credits}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-primary-main rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <CustomButton
                  className="w-full"
                //   disabled={loadingPlan && loadingPlan != plan.name}
                  loading={loadingPlan === plan.name}
                  onClick={() => handlePlanSelect(plan)}
                  // onClick={() => handlePlanSelect(plan.name)}
                >
                  Get Started
                </CustomButton>
              </CardContent>
            </div>
          ))}
        </div>
        <CustomButton
          variant="clear"
          className="w-full mt-4"
          onClick={() => dispatch(setShowPurchaseCreditDialog(false))}
          // onClick={() => handlePlanSelect(plan.name)}
        >
          Close
        </CustomButton>
      </DialogContent>
    </OutsideDismissDialog>
  );
};
