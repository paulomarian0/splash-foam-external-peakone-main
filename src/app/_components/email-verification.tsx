import React from "react";
import Footer from "./article/footer2";
import Image from "next/image";
import Link from "next/link";
import { siteLogo, siteProduct, emailVerificationLink } from "@/lib/site-info";
const EmailVerificationPage = () => {
  return (
    <div className="flex flex-col w-full items-center min-h-screen bg-white">
      <div className="flex w-full justify-center px-4 py-2 md:py-4 bg-[#f5f5f5]">
        <div className="flex w-full max-w-[1200px] justify-start">
          <Image src={siteLogo} alt={siteProduct} width={120} height={120} />
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 max-w-[800px] py-12 px-2 text-[#333]">
        <h1 className="text-4xl mb-6">Email Verification</h1>
        <p className="font-bold text-xl mb-4">
          Thank You for Verifiying Your Email Address
        </p>
        <p className="font-bold text-xl mb-4">
          Be on the lookout for our daily email with more life hacks & daily
          tips.
        </p>
        <p className="text-blue-500 font-bold text-2xl uppercase mt-6">Bonus</p>
        <Link
          href={emailVerificationLink}
          className="text-black bg-[#ff9900] font-bold text-xl hover:underline border-2 border-gray-200 rounded-md p-4  mt-4 text-center"
        >
          Checkout These 67 Lifehacks that Will Boost the Quality of Your Life!
        </Link>
      </div>
      <Footer />
    </div>
  );
};
export default EmailVerificationPage;
