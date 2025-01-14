import React from "react";
import CheckoutHeader from "./checkout/checkout-header";
import CheckoutForm from "./checkout/checkout-form-sticky";
import Footer from "./checkout/checkout-footer";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import FunnelFluxScripts from "@/lib/funnel-flux-scripts";
import CheckoutClickId from "./checkout/checkout-click-id";

type Props = {
  info: CheckoutPageType;
};

const CheckoutPage = ({ info }: Props) => {
  if (!info) {
    return (
      <div>
        Error: Unable to load checkout information. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative">
      <CheckoutHeader info={info} />
      <CheckoutForm info={info} />
      <Footer info={info} />
      <FunnelFluxScripts funnelFlux={info.funnelFlux} />
      <CheckoutClickId />
    </div>
  );
};

export default CheckoutPage;
