import React from "react";

export default function CardsLoading(props) {
  return (
    <div className="text-center">
      <svg
        width={props?.size ? props?.size : "8em"}
        height={props?.size ? props?.size : "8em"}
        viewBox="0 0 24 24"
      >
        <circle cx="18" cy="12" r="0" fill="#F9A826">
          <animate
            attributeName="r"
            values="0;2;0;0"
            dur="1.5s"
            repeatCount="indefinite"
            begin=".67"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle cx="12" cy="12" r="0" fill="#000000">
          <animate
            attributeName="r"
            values="0;2;0;0"
            dur="1.5s"
            repeatCount="indefinite"
            begin=".33"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle cx="6" cy="12" r="0" fill="#EB6C6C">
          <animate
            attributeName="r"
            values="0;2;0;0"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
      </svg>
    </div>
  );
}
