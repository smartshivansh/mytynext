import React from "react";
import FeedsBlogCard from "./FeedsBlogCard";
import FeedsImageCard from "./FeedsImageCard";
import FeedsLinkCard from "./FeedsLinkCard";
import FeedsQuoteCard from "./FeedsQuoteCard";
import FeedsVideoCard from "./FeedsVideoCard";
import { useInView } from "react-intersection-observer";

export default function FeedsCard({ data }) {
  const { ref, inView } = useInView({
    /* Optional options */
    root: document.querySelector("#feeds"),
    rootMargin: "25px 0px 0px 0px",
    threshold: 0.25,
    initialInView: false,
    triggerOnce: true,
    fallbackInView: true,
  });
  return (
    <div className="m-2" ref={ref}>
      {
        {
          BLOG: <FeedsBlogCard ref={ref} inView={inView} item={data} />,
          IMAGE: <FeedsImageCard ref={ref} inView={inView} data={data} />,
          VIDEO: <FeedsVideoCard ref={ref} inView={inView} data={data} />,
          QUOTE: <FeedsQuoteCard ref={ref} inView={inView} data={data} />,
          LINK: <FeedsLinkCard ref={ref} inView={inView} data={data} />,
        }[data.type]
      }
    </div>
  );
}
