import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import CardStyles from "./Card.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageCardPreview from "./ImageCardPreview";
// import { ReactComponent as PersonIcon } from "bootstrap-icons/icons/person-circle.svg";
// import { getSubdomainFromUser } from "./feedsCard.functions";
import FeedsCardAvatar from "./FeedsCardAvatar";
import { useInView } from "react-intersection-observer";
import ShareIcon from "bootstrap-icons/icons/share.svg";
import CardShareDialog from "./CardShareDialog";
import MenuIcon from "bootstrap-icons/icons/three-dots.svg";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import classes from "./AdminBlogItem.module.css";
// import "bootstrap/js/dist/modal.js";
import { ReactComponent as OptionsIcon } from "bootstrap-icons/icons/three-dots.svg";
import DownloadIcon from "bootstrap-icons/icons/download.svg";

export default function FeedsImageCard({ data, ref, inView }) {
  const [isOpen, setIsOpen] = useState(false);
  const persistent = true;
  const cancelButtonRef = useRef(null);
  const [shareDialog, setShareDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const base = process.env.REACT_APP_NAME;
  const _shareLink = `https://${data.user_id.subdomain}.${base}/image/${data._id}`;

  // const { ref, inView } = useInView({
  //   /* Optional options */
  //   root: document.querySelector("#feeds"),
  //   rootMargin: "2000px",
  //   threshold: 1,
  //   triggerOnce: true,
  // });

  const DownLoadmultipleFile = async (data) => {
    await setDownloading(true);

    await data.map(async (img, key) => {
      setTimeout(async () => {
        const anchor = document.createElement("a");
        anchor.href = img.src;
        anchor.download = "myty-img";
        document.body.appendChild(anchor);
        await anchor.click((e) => e.preventDefault());
      }, key * 1700);
    });
    return true;
  };

  return (
    <div ref={ref} className="feeds p-0">
      <div
        style={{
          cursor: "default",
        }}
      >
        <div className="row w-100 m-0 align-items-center mb-2">
          <div className="col-10 p-0">
            {inView && (
              <FeedsCardAvatar user={data?.user_id} username={data?.username} />
            )}
          </div>
          <div className="col-2  d-flex justify-content-end p-0 m-0 ">
            <div
              style={{
                cursor: "pointer",
              }}
              className="text-end card-options h-100 w-100 p-0"
            >
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
                      <Image src={ShareIcon} className="me-2" />
                      <span className="sidebar-menu-link">Share</span>
                    </div>
                    <div
                      className={`bg-transparent p-1 my-1 btn ${
                        downloading && "disabled"
                      }`}
                      onClick={() => {
                        setDownloading(true);
                        DownLoadmultipleFile(data.images);
                        setTimeout(() => {
                          setDownloading(false);
                        }, 2000);
                      }}
                    >
                      <Image src={DownloadIcon} className="me-2" />
                      {downloading ? (
                        <span className="sidebar-menu-link">
                          Please wait...
                        </span>
                      ) : (
                        <span className="sidebar-menu-link">Download</span>
                      )}{" "}
                    </div>
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
            cursor: "pointer",
          }}
          className="p-2"
          onClick={() => setIsOpen(true)}
        >
          {data?.images && inView && (
            <ImageCardPreview imageList={data.images} />
          )}

          {data.images && (
            <div className="p-0 m-0">
              <span
                className="text-truncate text-wrap text-break"
                dangerouslySetInnerHTML={{ __html: data.caption }}
              ></span>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={isOpen}
        initialFocus={cancelButtonRef}
        onClose={() => {
          if (!persistent) {
            setIsOpen(false);
          }
        }}
        // className="fixed z-10 inset-0 overflow-y-auto"
        className={`${CardStyles.dialog_wrapper} `}
      >
        <div
          // className="flex items-center justify-center min-h-screen"
          className={CardStyles.dialog_content_overlay_wrapper}
        >
          <Dialog.Overlay
            // className="fixed inset-0 bg-black opacity-30"
            className={CardStyles.dialog_overlay}
          />
          <div
            ref={cancelButtonRef}
            style={{
              zIndex: "30",
              position: "absolute",
              top: "0px",
              right: "0px",
            }}
            onClick={() => setIsOpen(false)}
          >
            <button className="btn-close btn-close-white btn-lg"></button>
          </div>
          <div
            // className="bg-white rounded max-w-sm mx-auto"
            className={`${CardStyles.dialog_content} px-0`}
          >
            <Carousel
              autoFocus
              showArrows
              dynamicHeight
              useKeyboardArrows
              swipeable
              showStatus={false}
              showThumbs={false}
              selectedItem={false}
            >
              {data.images !== [] &&
                data.images.map((data, key) => (
                  <div key={key}>
                    <div className="w-100">
                      <img
                        src={data.src}
                        className="vh-100 img-fluid"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                        alt=""
                      />
                    </div>
                    <span>Like{data?.likes?.likes?.length}</span>
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
      </Dialog>
      <CardShareDialog
        dialogOpen={shareDialog}
        setDialogOpen={setShareDialog}
        shareLink={_shareLink}
      />
    </div>
  );
}
