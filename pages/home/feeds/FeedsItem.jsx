import React from "react";
// import Tippy from "@tippyjs/react";
// import axios from "axios";
// import { ReactComponent as OptionsIcon } from "bootstrap-icons/icons/three-dots.svg";
// import { UseFeedsView } from "./FeedsContext";
import { ReactComponent as PersonIcon } from "bootstrap-icons/icons/person-circle.svg";
import { useRouteMatch } from "react-router-dom";

export default function FeedsItem({ item }) {
  const { path } = useRouteMatch();
  const url_segments = path.split("/");
  const orignalPath = url_segments[url_segments.length - 1];
  // const { openSelectedFeedItem } = UseFeedsView();

  // ! a inefficient implementation to go thru every card and store domain value for the user of that card
  // useEffect(() => {
  //   if (item) {
  //     axios.get(`/api/domain/findbyId/${item.user_id}`).then((res) => {
  //       addUserSubdomainVP(item.username, res.data.subdomain);
  //     });
  //   }
  // }, []);

  return (
    <div
      className="container p-4 bg-white shadow rounded-3"
      style={{
        cursor: "pointer",
      }}
      // onClick={() => openSelectedFeedItem(item)}
      onClick={() => {
        console.log(item);
        if (item?.user_id?.subdomain) {
          window.open(
            `https://${item?.user_id?.subdomain}.${process.env.REACT_APP_NAME}/blog/${item.slug}`,
            "_blank"
          );
        }
      }}
    >
      {orignalPath === "feeds" && (
        <div className="d-flex">
          <div className=" mb-3">
            <PersonIcon className="large-icon me-3" />
          </div>
          <div className="fw-bolder">
            {item?.user_id?.name || item?.username}
          </div>
        </div>
      )}
      {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
      <div className="text-center">
        {!!item?.featured_image && (
          <img
            className="img-fluid mb-4 rounded"
            src={item?.featured_image}
            alt=""
          />
        )}
      </div>

      <p className="btn text-start px-0 fs-3 fw-bold">
        {item?.title ?? "Untitled"}
      </p>
      <p className="text-muted small">{item?.last_update_date_string}</p>

      {/* <div className="text-end">
        <Tippy
          zIndex="1000"
          trigger="focus"
          theme="light"
          interactive={true}
          placement="bottom-end"
          content={
            <div className="d-flex flex-column align-items-start rounded-3">
              <button className="btn bg-transparent border-0">Preview</button>
            </div>
          }
        >
          <button className="bg-light rounded-3 border-0 shadow-sm">
            <OptionsIcon className="mid-icon" />
          </button>
        </Tippy>
      </div> */}
    </div>
  );
}
