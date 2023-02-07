import React from "react";
import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

export default function ImageCardPreview({ imageList }) {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 1,
    triggerOnce: true,
    // rootMargin: "200px 0px",
  });

  // useEffect(() => {
  // }, [inView]);
  // console.log("inview", inView);

  return (
    <div className="mb-0">
      {/* {imageList?.map((data, key) => (
        <div key={key} className="w-50">
          <img
            className="img-fluid h-100"
            style={{ objectFit: "cover", objectPosition: "center" }}
            src={`${data.src}`}
            alt=""
          />
        </div>
      ))} */}
      <div ref={ref} className="d-flex flex-wrap ">
        {/* {imageList.length === 1 && inView ? (
          imageList.map((data, key) => (
            <div key={key}>
              <img
                loading="lazy"
                className=" img-fluid "
                src={data.thumb ?? data.src ?? data}
                alt=""
              />
            </div>
          ))
        ) : (
          <div className="img-fluid" />
        )} */}
        {imageList.length === 1 &&
          imageList.map((data, key) => (
            <div className="w-100" key={key}>
              {/* <img
                loading="lazy"
                className=" img-fluid "
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
              /> */}
              <LazyLoadImage
                loading="lazy"
                className=" img-fluid w-100 object-cover object-center"
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
                effect="opacity"
                wrapperClassName="h-100 d-flex"
              />
            </div>
          ))}

        {/* {imageList.length === 2 && inView
          ? imageList.map((data, key) => (
              <div key={key} className="w-50">
                <img
                  loading="lazy"
                  className={
                    (key % 2 ? " ps-1 " : " ") +
                    " img-fluid object-cover object-center "
                  }
                  style={{
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                  src={data.thumb ?? data.src ?? data}
                  alt=""
                />
              </div>
            ))
          : imageList.map((data, key) => (
              <div
                key={key}
                className={
                  (key % 2 ? " ps-1 " : " ") +
                  " img-fluid object-cover object-center "
                }
              />
            ))} */}
        {imageList.length === 2 &&
          imageList.map((data, key) => (
            <div key={key} className="w-50">
              {/* <img
                loading="lazy"
                className={
                  (key % 2 ? " ps-1 " : " ") +
                  " img-fluid object-cover object-center h-100"
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
              /> */}
              <LazyLoadImage
                loading="lazy"
                className={
                  (key % 2 ? " ps-1 " : " ") +
                  " img-fluid object-cover object-center h-100"
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
                effect="opacity"
                wrapperClassName="h-100 d-flex"
              />
            </div>
          ))}

        {/* {imageList.length === 3 && inView
          ? imageList.map((data, key) => (
              <div key={key} className={key === 2 ? " h-50 " : " w-50 "}>
                <img
                  className={
                    (key === 2 ? " pt-1 " : " ") +
                    (key % 2 ? " ps-1 " : " ") +
                    " w-100 img-fluid object-cover object-center "
                  }
                  style={{
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                  src={data.thumb ?? data.src ?? data}
                  alt=""
                />
              </div>
            ))
          : imageList.map((data, key) => (
              <div
                className={
                  (key === 2 ? " pt-1 " : " ") +
                  (key % 2 ? " ps-1 " : " ") +
                  " w-100 img-fluid object-cover object-center "
                }
                alt=""
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
              />
            ))} */}
        {imageList.length === 3 &&
          imageList.map((data, key) => (
            <div key={key} className={key === 2 ? " h-50 " : " w-50 "}>
              {/* <img
                className={
                  (key === 2 ? " pt-1 " : " ") +
                  (key % 2 ? " ps-1 " : " ") +
                  " w-100 img-fluid object-cover object-center h-100"
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
              /> */}
              <LazyLoadImage
                className={
                  (key === 2 ? " pt-1 " : " ") +
                  (key % 2 ? " ps-1 " : " ") +
                  " w-100 img-fluid object-cover object-center h-100"
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
                effect="opacity"
                wrapperClassName="h-100 d-flex"
              />
            </div>
          ))}

        {/* {imageList.length === 4 && inView
          ? imageList.map((data, key) => (
              <div key={key} className="w-50">
                <img
                  loading="lazy"
                  className={
                    (key >= 2 && " pt-1 ") +
                    (key % 2 ? " ps-1  " : "  ") +
                    " img-fluid object-cover object-center "
                  }
                  style={{
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                  src={data.thumb ?? data.src ?? data}
                  alt=""
                />
              </div>
            ))
          : imageList.map((data, key) => (
              <div
                className={
                  (key === 2 ? " pt-1 " : " ") +
                  (key % 2 ? " ps-1 " : " ") +
                  " w-100 img-fluid object-cover object-center "
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
              />
            ))} */}
        {imageList.length === 4 &&
          imageList.map((data, key) => (
            <div key={key} className="w-50">
              {/* <img
                loading="lazy"
                className={
                  (key >= 2 && " pt-1 ") +
                  (key % 2 ? " ps-1  " : "  ") +
                  " img-fluid object-cover object-center h-100"
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
              /> */}
              <LazyLoadImage
                loading="lazy"
                className={
                  (key >= 2 && " pt-1 ") +
                  (key % 2 ? " ps-1  " : "  ") +
                  " img-fluid object-cover object-center h-100"
                }
                style={{
                  objectPosition: "center",
                  objectFit: "cover",
                }}
                src={inView ? data.thumb ?? data.src ?? data : ""}
                alt=""
                effect="opacity"
                wrapperClassName="h-100 d-flex"
              />
            </div>
          ))}

        {imageList.length > 4 &&
          imageList.map((data, key) => (
            <div
              key={key}
              style={
                key == 0
                  ? {
                      width: "100%",
                    }
                  : {
                      width: "33%",
                      marginTop: "5px",
                    }
              }
            >
              {key < 4 && (
                <div className="position-relative h-100">
                  {/* <img
                    loading="lazy"
                    className={
                      (key >= 2 && " ps-1 ") +
                      // (key % 2 ? " ps-1  " : "  ") +
                      " img-fluid object-cover object-center h-100"
                    }
                    style={{
                      objectPosition: "center",
                      objectFit: "cover",
                      // borderRadius: "8px",
                    }}
                    src={inView ? data.thumb ?? data.src ?? data : ""}
                    alt=""
                  /> */}
                  <LazyLoadImage
                    loading="lazy"
                    className={
                      (key >= 2 && " ps-1 ") +
                      // (key % 2 ? " ps-1  " : "  ") +
                      " img-fluid object-cover object-center h-100"
                    }
                    style={{
                      objectPosition: "center",
                      objectFit: "cover",
                      // borderRadius: "8px",
                    }}
                    src={inView ? data.thumb ?? data.src ?? data : ""}
                    alt=""
                    effect="opacity"
                    wrapperClassName="h-100 d-flex"
                  />
                  {key === 3 && (
                    <div
                      className=" position-absolute top-0 w-100 h-100 bg-white d-flex justify-content-center align-items-center fs-5 fw-bold ps-3"
                      style={{ opacity: 0.75 }}
                    >
                      & {imageList.length - 4} More
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
