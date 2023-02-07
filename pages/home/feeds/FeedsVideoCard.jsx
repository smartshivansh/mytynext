import React, { useState } from "react";
import VideoCardPreview from "./VideoCardPreview";
import FeedsCardAvatar from "./FeedsCardAvatar";
import { ReactComponent as ShareIcon } from "bootstrap-icons/icons/share.svg";
import CardShareDialog from "./CardShareDialog";
import { ReactComponent as MenuIcon } from "bootstrap-icons/icons/three-dots.svg";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import classes from "./AdminBlogItem.module.css";
import "bootstrap/js/dist/modal";
import { ReactComponent as DownloadIcon } from "bootstrap-icons/icons/download.svg";

export default function FeedsVideoCard({ data, ref, inView }) {
  const [shareDialog, setShareDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const base = process.env.REACT_APP_NAME;
  const _shareLink = `https://${data.user_id.subdomain}.${base}/video/${data._id}`;
  return (
    <div ref={ref} className="p-0">
      <div
        style={{
          cursor: "pointer",
        }}
      >
        <div className="row w-100 m-0 align-items-center mb-2">
          <div className="col-10 p-0">
            {inView && (
              <FeedsCardAvatar user={data.user_id} username={data?.username} />
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
                      href={data?.videos[0]?.src}
                      download="myty-image"
                      onClick={() => {
                        setDownloading(true);
                        setTimeout(() => {
                          setDownloading(false);
                        }, 2000);
                      }}
                    >
                      <DownloadIcon className="me-2" />
                      {downloading ? (
                        <span className="sidebar-menu-link">
                          Please wait...
                        </span>
                      ) : (
                        <span className="sidebar-menu-link">Download</span>
                      )}
                    </a>
                  </div>
                }
              >
                <MenuIcon className="me-0" width="30" height="30"></MenuIcon>
              </Tippy>
            </div>
          </div>
        </div>

        <div
          className="p-2"
          style={{
            border: "1px solid #C4C4C4",
            borderRadius: "5px",
          }}
        >
          {data && inView && <VideoCardPreview videoList={data} />}

          <div className="p-0">
            <span
              className="text-truncate text-wrap text-break"
              dangerouslySetInnerHTML={{ __html: data.caption }}
            ></span>
          </div>
          {/* <p className="small text-muted">
            {new Date(data.createdAt).toDateString()}
          </p> */}
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
