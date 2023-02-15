import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import PersonIcon from "bootstrap-icons/icons/person-circle.svg";
import { getSubdomainFromUser } from "./feedsCard.functions";
import WebsitePreview from "./WebsitePreview";
// import classes from "./TailwindEqTransitions.module.css";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function FeedsCardAvatar({ user, username }) {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const closeButtonRef = useRef();
  const frameRef = useRef(null);

  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.onload = () => {
        console.log("onload");
        setLoading(false);
      };
    }
  });

  return (
    <div>
      <WebsitePreview
        subdomain={user?.subdomain}
        show={showDialog}
        setShow={setShowDialog}
      />
      {/* On desktop Split pane View */}
      <div
        className="row w-100 m-0 align-items-center d-none d-sm-flex"
        style={{ cursor: "pointer" }}
        onClick={() => {
          // setLoading(true);
          setShowDialog(true);
          // setLink(getSubdomainFromUser(user));
        }}
      >
        <div className="col-3 col-sm-2 col-md-3">
          {user?.image_url ? (
            // <img
            //   className={"img-fluid rounded-circle img-thumbnail"}
            //   style={{
            //     marginLeft: "-0.6rem",
            //   }}
            //   src={user?.image_url_compress || user?.image_url}
            //   alt=""
            // />
            <LazyLoadImage
              className={"img-fluid rounded-circle img-thumbnail"}
              style={{
                marginLeft: "-0.6rem",
              }}
              src={user?.image_url_compress || user?.image_url}
              alt="img"
              effect="blur"
            />
          ) : (
            <Image src={PersonIcon}
              style={{
                marginLeft: "-0.6rem",
              }}
              className="img-fluid rounded-circle img-thumbnail"
              height="100%"
              width="100%"
            />
          )}
        </div>
        <div
          className="col-9 col-sm-10 col-md-9 text-left p-0"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "21px",
            fontFamily: "Poppins",
            marginLeft: "-1rem",
          }}
          dangerouslySetInnerHTML={{ __html: username ? username : user?.name }}
        ></div>
      </div>
      {/* On Mobile Open in new tab */}
      <div
        className="row w-100 m-0 align-items-center d-flex d-sm-none"
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.open(getSubdomainFromUser(user), "_self");
        }}
      >
        <div className="col-3 col-sm-2 col-md-3">
          {user?.image_url ? (
            <img
              className={"img-fluid rounded-circle img-thumbnail"}
              style={{
                marginLeft: "-1rem",
              }}
              src={user?.image_url_compress || user?.image_url}
              alt=""
            />
          ) : (
            <Image src={PersonIcon}
              style={{
                marginLeft: "-0.6rem",
              }}
              className="img-fluid rounded-circle img-thumbnail"
              height="100%"
              width="100%"
            />
          )}
        </div>
        <div
          className="col-9 col-sm-10 col-md-9 text-left p-0"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "21px",
            fontFamily: "Poppins",
            marginLeft: "-1rem",
          }}
          dangerouslySetInnerHTML={{ __html: user?.name }}
        ></div>
      </div>
    </div>
  );
}
