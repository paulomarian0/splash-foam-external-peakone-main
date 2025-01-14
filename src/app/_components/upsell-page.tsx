"use client";
import React, { useEffect, useState, Suspense } from "react";
import UpsellTemplate1 from "./upsell/upsell-template1";
import UpsellTemplate2 from "./upsell/upsell-template2";
import UpsellTemplate3 from "./upsell/upsell-template3";
import UpsellTemplate4 from "./upsell/upsell-template4";
import UpsellTemplate5 from "./upsell/upsell-template5";
import UpsellTemplate6 from "./upsell/upsell-template6";
import { UpsellPageType } from "@/interfaces/upsellPage";
import { useSearchParams } from "next/navigation";
import { useSession } from "../_context/SessionContext";
import { useRouter } from "next/navigation";
import useMixpanelId from "../_utils/useMixpanelId";
import { sendGAEvent } from "@next/third-parties/google";
import { createJimmyKey } from "../_utils/jimmyKeyUtils";

type Props = {
  info: UpsellPageType;
};

const GrabURLParams = () => {
  const mixpanelId = useMixpanelId();
  const { sessionId } = useSession();
  const searchParams = useSearchParams();
  const alt_pay_method = searchParams.get("alt_pay_method");
  const paypal_order_id = searchParams.get("orderId");
  const paypal_error_found = searchParams.get("errorFound");
  const router = useRouter();

  useEffect(() => {
    const updateSession = async (
      sessionId: string,
      updates: Record<string, any>
    ) => {
      try {
        const response = await fetch("/api/session/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jimmy-key": createJimmyKey().encryptedData,
          },
          body: JSON.stringify({
            sessionId,
            updates,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        const reportError = await fetch("/api/utility/send-slack-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jimmy-key": createJimmyKey().encryptedData,
          },
          body: JSON.stringify({
            message: "Error - Updating Session Failed - Upsell1 Page",
            errorDetails: error,
            userInfo: { sessionId },
          }),
        });
        console.error("Error updating session:", error);
        return null;
      }
    };

    const capturePaypalSession = async (
      sessionId: string,
      updates: Record<string, any>
    ) => {
      try {
        const response = await fetch("/api/session/capture-paypal-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jimmy-key": createJimmyKey().encryptedData,
          },
          body: JSON.stringify({
            sessionId,
            updates,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        const reportError = await fetch("/api/utility/send-slack-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jimmy-key": createJimmyKey().encryptedData,
          },
          body: JSON.stringify({
            message:
              "Error Updating Session - Capture PayPal Purchase - Upsell Page",
            errorDetails: error,
            userInfo: { sessionId, mixpanelId },
          }),
        });

        console.error("Error updating session:", error);
        return null;
      }
    };
    const setLocalStorageWithExpiry = (
      key: string,
      value: string,
      ttl: number
    ) => {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    };

    const getLocalStorageWithExpiry = (key: string) => {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    };

    const capturePaypalOrderInfo = async () => {
      if (alt_pay_method !== "paypal") return;
      if (!sessionId) return;

      // Check if we've already captured this order
      const capturedOrderId = getLocalStorageWithExpiry(
        "capturedPaypalOrderId"
      );
      if (capturedOrderId === paypal_order_id) {
        return;
      }

      try {
        if (paypal_order_id && paypal_error_found === "0") {
          sendGAEvent("event", "capture_paypal_order", {
            sessionId: sessionId,
          });
          const paypalOrderInfo = Object.fromEntries(searchParams);
          // console.log(
          //   "Capture Paypal Order Info: ",
          //   Object.fromEntries(searchParams)
          // );
          const updates = {
            currentStep: "1",
            paymentType: "paypal",
            paypalOrder: paypalOrderInfo,
            orderConfirmedAt: new Date().toISOString(),
            // customFields: {
            //   cf33: "0",
            //   cf43: paypal_order_id,
            // },
          };

          await capturePaypalSession(sessionId, updates);
          // Store the captured order ID in local storage with 24-hour expiry
          setLocalStorageWithExpiry(
            "capturedPaypalOrderId",
            paypal_order_id,
            24 * 60 * 60 * 1000
          );
        } else {
          console.error("Failed to Update Session w/ PayPal Order Info");
          const reportError = await fetch("/api/utility/send-slack-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-jimmy-key": createJimmyKey().encryptedData,
            },
            body: JSON.stringify({
              message: "Error with Capture PayPal Purchase - Upsell Page",
              errorDetails:
                "Capture PayPal Order Failed - Most Likely User Cancelled",
              userInfo: { sessionId },
            }),
          });
          //reset the session payment type
          const updates = {
            paymentType: "credit",
            currentStep: "0",
          };
          await updateSession(sessionId, updates);
          alert("Error with PayPal Order. Please try again.");
          console.error("Error with PayPal Order. Sending back to checkout.");
          router.push("/checkout");
        }
      } catch (err) {
        console.error("Error capturing order info:", err);
      }
    };
    capturePaypalOrderInfo();
  }, [alt_pay_method, searchParams, sessionId]);
  return <></>;
};

const UpsellPage = ({ info }: Props) => {
  const [queryString, setQueryString] = useState<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryObj: { [key: string]: string | string[] } = {};

    searchParams.forEach((value, key) => {
      if (queryObj[key]) {
        if (Array.isArray(queryObj[key])) {
          (queryObj[key] as string[]).push(value);
        } else {
          queryObj[key] = [queryObj[key] as string, value];
        }
      } else {
        queryObj[key] = value;
      }
    });

    const encoded = Object.entries(queryObj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            .join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          value as string
        )}`;
      })
      .join("&");

    setQueryString(encoded);
  }, []);

  return (
    <Suspense>
      <GrabURLParams />
      {info.template === "1" && (
        <UpsellTemplate1 info={info} queryString={queryString} />
      )}
      {info.template === "2" && (
        <UpsellTemplate2 info={info} queryString={queryString} />
      )}

      {info.template === "3" && (
        <UpsellTemplate3 info={info} queryString={queryString} />
      )}

      {info.template === "4" && (
        <UpsellTemplate4 info={info} queryString={queryString} />
      )}
      {info.template === "5" && (
        <UpsellTemplate5 info={info} queryString={queryString} />
      )}

      {info.template === "6" && (
        <UpsellTemplate6 info={info} queryString={queryString} />
      )}
    </Suspense>
  );
};

export default UpsellPage;
