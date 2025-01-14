import React from "react";
import ThankYouHeader from "./thank-you/thank-you-header";
import ThankYouDetails from "./thank-you/thank-you-details";
import ThankYouFooter from "./thank-you/thank-you-footer";

const ThankYouPage = () => {
  return (
    <div className="flex flex-col items-center relative min-h-screen">
      <ThankYouHeader step={7} />
      <ThankYouDetails />
      <ThankYouFooter />
    </div>
  );
};

export default ThankYouPage;
