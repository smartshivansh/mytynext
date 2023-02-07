import React from "react";
import LinkCardPreview from "./LinkCardPreview";
import FeedsCardAvatar from "./FeedsCardAvatar";

export default function FeedsLinkCard({ data }) {
  return (
    <div
      className="p-0 "
      style={{
        cursor: "default",
      }}
    >
      <div className="row w-100 m-0 align-items-center mb-2">
        <div className="col-10 p-0">
          <FeedsCardAvatar user={data.user_id} username={data?.username} />
        </div>
      </div>

      <div
        style={{
          cursor: "pointer",
          border: "1px solid #C4C4C4",
          borderRadius: "5px",
        }}
        onClick={() => {
          window.open(data.link, "_blank");
        }}
      >
        <LinkCardPreview data={data} metadata={data.metadata} />
      </div>
    </div>
  );
}
