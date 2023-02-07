import React, { useState } from "react";
import Image from "next/image";
import { useRouteMatch } from "react-router-dom";
import FeedsCardAvatar from "./FeedsCardAvatar";
import ShareIcon from "bootstrap-icons/icons/share.svg";

import MenuIcon from "bootstrap-icons/icons/three-dots.svg";
import style from "./Card.module.css";
import CardShareDialog from "./CardShareDialog";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import "bootstrap/js/dist/modal";
import DownloadIcon from "bootstrap-icons/icons/download.svg";

export default function FeedsBlogCard({ item, ref, inView }) {
  const { path } = useRouteMatch();
  const url_segments = path.split("/");
  const orignalPath = url_segments[url_segments.length - 1];
  const [shareDialog, setShareDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const base = process.env.REACT_APP_NAME;
  const _shareLink = `https://${item?.user_id?.subdomain}.${base}/blog/${item?.slug}`;
  return (
    <div
      ref={ref}
      className="p-0"
      style={{
        cursor: "pointer",
      }}
    >
      <div className="row w-100 m-0 align-items-center mb-2">
        <div className="col-10 p-0 ">
          {inView && (
            <FeedsCardAvatar
              user={item?.user_id}
              username={item?.user_fullname}
            />
          )}
        </div>

        <div className="col-2  d-flex justify-content-end p-0 m-0 ">
          <div className="text-end card-options h-100 w-100 p-0">
            <Tippy
              zIndex="8"
              trigger="focus"
              theme="light"
              interactive={true}
              placement="bottom-end"
              content={
                <div className="d-flex flex-column align-items-start px-2 rounded-3">
                  <div
                    className="bg-transparent p-1 my-1 btn"
                    onClick={() => {
                      setShareDialog(true);
                    }}
                  >
                    <ShareIcon className="me-2" />
                    <span className="sidebar-menu-link">Share</span>
                  </div>
                  <a
                    className={`bg-transparent p-1 my-1 btn ${
                      downloading && "disabled"
                    }`}
                    href={item?.featured_image}
                    download="myty-image"
                    onClick={() => {
                      setDownloading(true);
                      setTimeout(() => {
                        setDownloading(false);
                      }, 2000);
                    }}
                  >
                    <Image src={DownloadIcon} className="me-2" />
                    {downloading ? (
                      <span className="sidebar-menu-link">Please wait...</span>
                    ) : (
                      <span className="sidebar-menu-link">Download</span>
                    )}
                  </a>
                </div>
              }
            >
              <Image src={MenuIcon} className="me-0" width="30" height="30" />
            </Tippy>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #C4C4C4",
          borderRadius: "5px",
        }}
        onClick={() => {
          if (item?.user_id?.subdomain) {
            window.open(
              `https://${item?.user_id?.subdomain}.${process.env.REACT_APP_NAME}/blog/${item.slug}`,
              "_blank"
            );
          }
        }}
      >
        <div className="">
          <div className="p-2">
            {item?.featured_image && (
              <>
                {inView && (
                  <div className="text-center">
                    {/* <img
                      className={`img-fluid w-100 ${style.myDIV}`}
                      src={`${item?.featured_image}`}
                      alt=""
                    /> */}
                    <LazyLoadImage
                      className={`img-fluid w-100 ${style.myDIV}`}
                      src={`${item?.featured_image}`}
                      alt=""
                      effect="opacity"
                      wrapperClassName="h-100 d-flex"
                    />
                  </div>
                )}
              </>
            )}
            <div
              // className={`${style.toShow}`}
              className="d-flex justify-content-between"
            >
              <span
                className="text-truncate text-wrap text-break"
                dangerouslySetInnerHTML={{ __html: item?.title }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <CardShareDialog
        dialogOpen={shareDialog}
        setDialogOpen={setShareDialog}
        shareLink={_shareLink}
      />
    </div>
  );
}
