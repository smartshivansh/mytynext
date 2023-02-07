import React, { useEffect } from "react";
import { ReactComponent as PersonIcon } from "bootstrap-icons/icons/person-circle.svg";
import FeedsCardAvatar from "./FeedsCardAvatar";

export default function FeedsQuoteCard({ data }) {
  // useEffect(() => {
  // }, [inView]);

  return (
    <div className="p-0 ">
      <div
        style={{
          cursor: "default",
        }}
      >
        <div className="row w-100 m-0 align-items-center ">
          <div className="col-10 p-0">
            <FeedsCardAvatar user={data?.user_id} username={data?.username} />
          </div>
        </div>

        <div
          className="p-2 mt-2"
          style={{
            border: "1px solid #C4C4C4",
            borderRadius: "5px",
          }}
        >
          {data.quote && (
            <span
              className={`text-start fs-${data.size} fw-bold text-truncate text-wrap text-break`}
              dangerouslySetInnerHTML={{ __html: data.quote }}
            ></span>
          )}
          {data?.quoted_by && (
            <p
              className="text-muted text-end text-truncate text-wrap text-break"
              style={{ margin: "0" }}
              dangerouslySetInnerHTML={{ __html: data?.quoted_by }}
            ></p>
          )}
          {/* <p className='small text-muted'>
            {new Date(data.createdAt).toDateString()}
          </p> */}
        </div>
      </div>
    </div>
  );
}
