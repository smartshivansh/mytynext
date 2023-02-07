import React from "react";
// import axios from "axios";
// import apis from "../../constants/apis";

export default function LinkCardPreview({ data, metadata }) {
  return (
    <div className="p-2">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "4.5fr 7.5fr",
          gridGap: "5px",
        }}
        className=""
      >
        <div style={{ maxHeight: "125px" }}>
          {metadata && (
            <img
              className="m-0 p-0 w-100 h-100 img-fluid object-cover object-center"
              style={{
                objectFit: "cover",
              }}
              src={metadata?.image || metadata?.icon || metadata?.img}
              alt=""
            />
          )}
        </div>
        <div className="">
          <div className="">
            <p
              style={{
                margin: "0",
                fontSize: "12px",
                fontWeight: "400",
                lineHeight: "18px",
              }}
            >
              {metadata.title && metadata?.title.length > 70 ? (
                <span className="text-primary">
                  {metadata?.title.slice(0, 70)}
                  ...more
                </span>
              ) : (
                <span className="text-primary">{metadata?.title}</span>
              )}

              {/* <span className="text-primary">
                {metadata?.title}
              </span> */}

            </p>
            <p
              style={{
                margin: "0",
                fontSize: "10px",
                fontWeight: "400",
                lineHeight: "12px",
                color: "#999999",
              }}
              className="text-truncate text-wrap text-break mt-1"
            >



              {metadata.description && metadata?.description.length > 150 ? (
                <span>
                  {metadata?.description.slice(0, 150)}
                  ...more
                </span>
              ) : (
                <span>{metadata?.description}</span>
              )}




              {/* <span>
                {metadata?.description}
              </span> */}
            </p>
            <a
              style={{
                margin: "0",
                fontSize: "10px",
                fontWeight: "400",
                lineHeight: "12px",
                color: "#999999",
              }}
              className="text-truncate text-wrap text-break mt-1"
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.link}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}