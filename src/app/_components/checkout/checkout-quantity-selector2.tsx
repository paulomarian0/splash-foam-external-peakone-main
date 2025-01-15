import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "@/app/_context/SessionContext";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { ProductInfoType } from "@/interfaces/productInfo";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { delay } from "@/app/_utils/delay";
import { PriceDisplaySimple } from "./checkout-price-display";

type QuantityProps = {
  product: ProductInfoType;
  info: CheckoutPageType;
  setProduct: (product: ProductInfoType) => void;
  couponActive: boolean;
  country: string;
};

// Select the number of products to purchase
const QuantitySelector2 = ({
  product,
  info,
  setProduct,
  couponActive,
  country,
}: QuantityProps) => {
  const handleProductClick = (
    productNum: number,
    productPrice: number,
    productShipping: number,
    productShippingId: number,
    productOfferId: number,
    productStickyId: number
  ) => {
    setProduct({
      product: productNum,
      productName: `${productNum + 1}x ${info.product.name}`,
      productPrice: productPrice.toString(),
      productShipping: productShipping.toString(),
      productShippingId: productShippingId.toString(),
      productOfferId: productOfferId.toString(),
      productStickyId: productStickyId.toString(),
    });
  };

  const [price1, setPrice1] = useState(Number(info.product.price1));
  const [price2, setPrice2] = useState(Number(info.product.price2));
  const [price3, setPrice3] = useState(Number(info.product.price3));

  const [showCouponFlag, setShowCouponFlag] = useState(false);

  useEffect(() => {
    function scrollIfNotVisible(elementId: string) {
      const element = document.getElementById(elementId);

      if (!element) return; // Exit if the element is not found

      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Check if the element is completely within the viewport
      const isCompletelyVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      // If not fully visible, scroll into view
      if (!isCompletelyVisible) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center", // Adjust this if you want it to align differently
        });
      }
    }

    const changePriceDrama = async () => {
      scrollIfNotVisible("quantity-selector");
      document.getElementById("price1")!.style.background = "#5acd65";
      await delay(200);
      setPrice1(price1 - parseFloat(info.product.couponValue));
      document.getElementById("price1")!.style.background = "none";
      document.getElementById("price2")!.style.background = "#5acd65";
      await delay(200);
      setPrice2(price2 - parseFloat(info.product.couponValue));
      document.getElementById("price2")!.style.background = "none";
      document.getElementById("price3")!.style.background = "#5acd65";
      await delay(200);
      setPrice3(price3 - parseFloat(info.product.couponValue));
      document.getElementById("price3")!.style.background = "none";
      document.getElementById("price4")!.style.background = "#5acd65";
      setShowCouponFlag(true);
    };
    if (couponActive) {
      changePriceDrama();
    }
  }, [couponActive]);

  return (
    <>
      <div
        className="flex w-full justify-between items-center pb-6"
        id="quantity-selector"
      >
        <div className="flex w-full">
          <Cog6ToothIcon className="h-[16px] w-[16px] mr-2" />
          <h3 className="font-bold text-[16px]">Step 1: Select Quantity</h3>
        </div>
      </div>

      <div className="flex flex-col w-full justify-center items-center gap-6">
        <div
          className={`flex w-full border-[1px] border-[#0917df] rounded-md cursor-pointer hover:shadow-sm transition-all p-4 ${
            product.product === 0 && "border-blue-100 bg-[#fffccc]"
          }`}
          onClick={() => {
            handleProductClick(
              0,
              Number(info.product.price1),
              Number(info.product.ship1),
              Number(info.product.shippingId1),
              Number(info.product.offerId1),
              Number(info.product.stickyId1)
            );
          }}
        >
          <div className="flex w-1/3 justify-center items-center">
            <Image
              src={info.product.image1}
              width={200}
              height={200}
              alt="1 Pair"
            />
          </div>
          <div className="flex flex-col w-2/3 justify-start items-center text-[#282828] text-center">
            <p className="text-[18px] font-bold">Buy 1 Pair</p>
            <p className="relative inline-block text-[16px] font-medium px-1">
              ${info.product.ogPrice1}
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-red-600 transform -rotate-12"></span>
            </p>

            <p className="text-[20px] text-[#000] font-bold">${price1}</p>
            <p className="text-[14px] text-[#5acd65] font-medium">
              You Save ${(Number(info.product.ogPrice1) - price1).toFixed(2)}
            </p>
          </div>
        </div>

        <div
          className={`flex w-full border-[1px] border-[#0917df] rounded-md cursor-pointer hover:shadow-sm transition-all p-4 ${
            product.product === 1 && "border-blue-100 bg-[#fffccc]"
          }`}
          onClick={() => {
            handleProductClick(
              1,
              Number(info.product.price2),
              Number(info.product.ship2),
              Number(info.product.shippingId2),
              Number(info.product.offerId2),
              Number(info.product.stickyId2)
            );
          }}
        >
          <div className="absolute bg-gradient-to-b from-blue-400 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-md top-2 left-2">
            BESTSELLER
          </div>
          <div className="flex w-1/3 justify-center items-center">
            <Image
              src={info.product.image2}
              width={200}
              height={200}
              alt="2 Pair"
            />
          </div>
          <div className="flex flex-col w-2/3 justify-start items-center text-[#282828] text-center">
            <p className="text-[18px] font-bold">Buy 2 Pair</p>
            <p className="text-[14px] text-red-500 font-bold">50% OFF</p>
            <p className="relative inline-block text-[16px] font-medium px-1">
              ${info.product.ogPrice2}
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-red-600 transform -rotate-12"></span>
            </p>
            <p className="text-[20px] text-[#000] font-bold">${price2}</p>
            <p className="text-[14px] text-[#5acd65] font-medium">
              You Save ${(Number(info.product.ogPrice2) - price2).toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className={`flex w-full border-[1px] border-[#0917df] rounded-md cursor-pointer hover:shadow-sm transition-all p-4 ${
            product.product === 2 && "border-blue-100 bg-[#fffccc]"
          }`}
          onClick={() => {
            handleProductClick(
              2,
              Number(info.product.price3),
              Number(info.product.ship3),
              Number(info.product.shippingId3),
              Number(info.product.offerId3),
              Number(info.product.stickyId3)
            );
          }}
        >
          <div className="flex w-1/3 justify-center items-center">
            <Image
              src={info.product.image3}
              width={200}
              height={200}
              alt="3 Pair"
            />
          </div>
          <div className="flex flex-col w-2/3 justify-start items-center text-[#282828] text-center">
            <p className="text-[18px] font-bold">Buy 3 Pair</p>
            <p className="text-[14px] text-red-500 font-bold">60% OFF</p>
            <p className="relative inline-block text-[16px] font-medium px-1">
              ${info.product.ogPrice3}
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-red-600 transform -rotate-12"></span>
            </p>
            <p className="text-[20px] text-[#000] font-bold">${price3}</p>
            <p className="text-[14px] text-[#5acd65] font-medium">
              You Save ${(Number(info.product.ogPrice3) - price3).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuantitySelector2;
