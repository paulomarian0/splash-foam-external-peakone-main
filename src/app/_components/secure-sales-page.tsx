"use client";
import { useEffect, useState } from "react";
import { SalesPageType } from "@/interfaces/salesPage";
import FunnelFluxScripts from "@/lib/funnel-flux-scripts";

type Props = {
  info: SalesPageType;
};

const SalesPage = ({ info }: Props) => {
  const [queryString, setQueryString] = useState<{
    [key: string]: string | string[];
  }>({});
  const [encodedQueryString, setEncodedQueryString] = useState("");

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

    setQueryString(queryObj);

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

    setEncodedQueryString(encoded);
  }, []);

  return (
    <div className="flex flex-col items-center relative">
      <FunnelFluxScripts funnelFlux={info.funnelFlux} />
    </div>
  );
};

export default SalesPage;
