import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  feedsCleanup,
  setFeedDataAsync,
  setNewFeedDataAsync,
} from "../../../store/feedsSlice";
import FeedsCard from "./FeedsCard";
import { useInView } from "react-intersection-observer";
import { searchCleanup } from "../../../store/SearchSlice";
import TopArrowIcon from "bootstrap-icons/icons/chevron-up.svg";

import LoadingSkele from "./LoadingSkele";

export default function Feeds() {
  const [scrolled, setScrolled] = useState(false);
  const page = useRef(0);

  const [currentUrl, setCurrentUrl] = useState("");
  const [currentHref, setCurrentHref] = useState("");

  useEffect(() => {
    setCurrentHref(window.location.href);
    setCurrentUrl(
      process.env.REACT_APP_LINK_PROTOCOL +
        process.env.REACT_APP_LINK_HOST +
        "/"
    );
  }, []);

  // const ref = useRef();
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.25,
  });

  const { feeds, loading, error, newLoading } = useSelector(
    (state) => state.feeds
  );
  const { searchFeeds, searchLoading, setSuggestionLoading, searchError } =
    useSelector((state) => state.search);

  const dispatch = useDispatch();

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget;
      if (window.scrollY > 256) {
        setShowScrollToTop(true);
      }
      if (window.scrollY < 256) {
        setShowScrollToTop(false);
      }
    },
    [showScrollToTop]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleNavigation);
    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);

  useEffect(() => {
    dispatch(setFeedDataAsync({ page: page.current }));
    return () => {
      console.log("cleanup ran ");
      dispatch(searchCleanup());
      dispatch(feedsCleanup());
    };
  }, []);

  const scrollToEnd = () => {
    if (!scrolled) {
      setScrolled(true);
      console.log("scrolled ran", page.current);
      page.current += 1;
      dispatch(setNewFeedDataAsync({ page: page.current }));
      setTimeout(() => setScrolled(false), 5000);
    }
  };

  if (inView) {
    scrollToEnd();
  }

  return (
    <div
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      {(error || searchError) && (
        <div className="alert alert-brand-accent text-center">
          {searchError === "Network Error"
            ? "There is some problem with your network. Please check your connection and try again. "
            : searchError}
          {error === "Something went wrong."}
        </div>
      )}
      {loading || searchLoading ? (
        <div>
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              325: 1,
              540: 2,
              1024: 3,
              1439: 4,
            }}
          >
            <Masonry>
              <LoadingSkele heighLowerSection={`40vh`} />
              <LoadingSkele heighLowerSection={`60vh`} />
              <LoadingSkele heighLowerSection={`50vh`} />
              <LoadingSkele heighLowerSection={`30vh`} />
            </Masonry>
          </ResponsiveMasonry>
        </div>
      ) : (
        <div id="feeds dashboard">
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              325: 1,
              540: 2,
              1024: 3,
              1439: 4,
            }}
          >
            <Masonry>
              {searchFeeds
                ? currentUrl === currentHref
                  ? searchFeeds
                      ?.map((data, key) => <FeedsCard key={key} data={data} />)
                      .filter(function (el) {
                        return (
                          el.props.data.private === false ||
                          el.props.data.private === undefined
                        );
                      })
                  : searchFeeds?.map((data, key) => (
                      <FeedsCard key={key} data={data} />
                    ))
                : currentUrl === currentHref
                ? feeds
                    ?.map((data, key) => <FeedsCard key={key} data={data} />)
                    .filter(function (el) {
                      return el.props.data.private === false;
                    })
                : feeds?.map((data, key) => (
                    <FeedsCard key={key} data={data} />
                  ))}
            </Masonry>
          </ResponsiveMasonry>
          {!searchFeeds && (
            <div
              style={{ height: "20px", color: "red" }}
              ref={ref}
              className={loading || newLoading ? "d-none" : "d-block"}
            >
              {inView && `Yep, I'm on screen`}
            </div>
          )}
          {/* {newLoading ||
            (searchLoading && (
              <div className="fixed-bottom ">
                <CardsLoading size={"15em"} />
              </div>
            ))} */}
          {newLoading ||
            (searchLoading && (
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  325: 1,
                  540: 2,
                  1024: 3,
                  1439: 4,
                }}
              >
                <Masonry>
                  <LoadingSkele heighLowerSection={`60vh`} />
                  <LoadingSkele heighLowerSection={`40vh`} />
                  <LoadingSkele heighLowerSection={`50vh`} />
                  <LoadingSkele heighLowerSection={`30vh`} />
                </Masonry>
              </ResponsiveMasonry>
            ))}
        </div>
      )}
      {showScrollToTop && !searchLoading && (
        <div className="position-fixed bottom-0 end-0 mb-3 me-3">
          <div
            className="btn bg-brand-primary h-auto p-3 rounded-circle"
            onClick={() => {
              window.scrollTo({ top: 0 });
            }}
          >
            <Image src={TopArrowIcon} className="large-icon" />
          </div>
        </div>
      )}
    </div>
  );
}
