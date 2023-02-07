import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import style from "./LoadingSkele.module.css";
const LoadingSkele = ({ heighLowerSection }) => {
  return (
    <div
      className="p-2 mb-3 "
      style={{
        cursor: "pointer",
        zIndex: 0,
        position: "sticky",
        top: "25%",
      }}
    >
      <div
        className={`mb-2 w-100  text-start align-items-center ${style.mainDiv}`}
      >
        <div className={`  ${style.imgDiv}`}>
          <Skeleton
            circle
            style={{
              height: "55px",
              width: "55px",
              zIndex: 0,
            }}
          />
        </div>
        <div className={`  ${style.middleDiv}`}>
          <Skeleton
            style={{
              height: "25px",
              width: "8rem",
              zIndex: 0,
            }}
          />
        </div>
        <div className={` d-flex justify-content-end ${style.lastDiv}`}>
          <Skeleton
            style={{
              height: "25px",
              width: "3rem",
              zIndex: 0,
            }}
          />
        </div>
      </div>
      <div className={`${style.BigDiv}`}>
        <Skeleton
          style={{
            height: heighLowerSection,
            width: "100%",
            padding: "30px",
            zIndex: 0,
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSkele;
