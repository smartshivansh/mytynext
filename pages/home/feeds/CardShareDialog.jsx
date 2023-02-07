import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { ReactComponent as CancelIcon } from "bootstrap-icons/icons/x.svg";
import card from "./Card.module.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

export default function CardShareDialog({
  dialogOpen,
  setDialogOpen,
  shareLink,
}) {
  const cancelButtonRef = useRef();

  const [linkCopied, setLinkCopied] = useState();

  function copyShareLink(url) {
    console.log(shareLink);
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 1000);
  }

  return (
    <div>
      <Dialog
        open={dialogOpen}
        initialFocus={cancelButtonRef}
        onClose={() => {
          return;
        }}
        className={`${card.dialog_wrapper} `}
      >
        <div className={`${card.dialog_content_overlay_wrapper} modal-dialog`}>
          <Dialog.Overlay className={card.confirmation_dialog_overlay} />

          <div className={`${card.dialog_content} modal-content rounded`}>
            <div className="modal-header">
              <p className="fs-3 mb-0 pb-0">Share Card</p>
              {/* <button
                  ref={cancelButtonRef}
                  className="btn "
                  >
                  <CancelIcon className="xl-icon" />
                </button> */}
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setDialogOpen(false);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center pb-3">
                <div className="p-4">
                  <FacebookShareButton
                    className="d-flex align-items-center py-2"
                    url={shareLink}
                  >
                    {/* <FacebookIcon size={32} round={true} /> */}
                    <svg
                      style={{ width: "32px", height: "32px" }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                      />
                    </svg>
                    <div className="ps-3">Facebook</div>
                  </FacebookShareButton>

                  <TwitterShareButton
                    className="d-flex align-items-center py-2"
                    url={shareLink}
                  >
                    {/* <TwitterIcon size={32} round={false} /> */}
                    <svg
                      style={{ width: "32px", height: "32px" }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
                      />
                    </svg>
                    <div className="ps-3">Twitter</div>
                  </TwitterShareButton>

                  {/* <InstapaperShareButton
                    className="d-flex align-items-center py-2"
                    url={shareLink}
                  >
                    <svg
                      style={{ width: "32px", height: "32px" }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
                      />
                    </svg>
                    <div className="ps-3">Instagram</div>
                  </InstapaperShareButton> */}

                  <WhatsappShareButton
                    className="d-flex align-items-center py-2"
                    url={shareLink}
                  >
                    <svg
                      style={{ width: "32px", height: "32px" }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z"
                      />
                    </svg>
                    <div className="ps-3">Whatsapp</div>
                  </WhatsappShareButton>

                  <div
                    className="btn d-flex align-items-center px-0 py-2"
                    onClick={() => {
                      copyShareLink(shareLink);
                    }}
                  >
                    <svg
                      style={{ width: "32px", height: "32px" }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"
                      />
                    </svg>
                    <div className="ps-3">Copy the link</div>
                  </div>
                  {linkCopied && (
                    <div className="small text-muted">copied!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
