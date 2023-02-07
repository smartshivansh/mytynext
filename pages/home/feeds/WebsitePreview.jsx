import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import React, { Fragment, useRef, useState, useEffect } from "react";
import apis from "../constants/apis";
import CardsLoading from "./CardsLoading";

export default function WebsitePreview({ subdomain, show, setShow }) {
  const closeButton = useRef(null);
  const iframeRef = useRef(null);

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (iframeRef?.current) {
      iframeRef.current.onload = () => {
        setLoading(false);
      };
    }
  });

  useEffect(() => {
    if (show) {
      const protocol = process.env.REACT_APP_LINK_PROTOCOL;
      const host = process.env.REACT_APP_LINK_HOST;
      const _url = `${protocol}${subdomain}.${host}`;
      setLink(_url);
    }
  }, [show]);

  return (
    <div>
      <button className="d-none btn" onClick={() => {}}></button>

      <Transition appear show={show} as={Fragment}>
        <Dialog
          open={show}
          initialFocus={closeButton}
          onClose={() => {
            setShow(false);
            setLink("");
          }}
          className="position-fixed top-0 end-0 bottom-0 start-0 bg-brand-light-gray"
          style={{ zIndex: "2", backdropFilter: "blur(2px)" }}
        >
          <div className="d-flex justify-content-end">
            <Transition.Child
              as={Fragment}
              enter="overlay-enter ease-out duration-300"
              enterFrom="overlay-enter-from opacity-0"
              enterTo="overlay-enter-to opacity-100"
              leave="overlay-leave ease-in duration-200"
              leaveFrom="overlay-leave-from opacity-100"
              leaveTo="overlay-leave-to opacity-0"
            >
              <Dialog.Overlay className="position-fixed top-0 end-0 bottom-0 start-0" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="content-enter"
              enterFrom="content-enter-from"
              enterTo="content-enter-to"
              leave="content-leave"
              leaveFrom="content-leave-from"
              leaveTo="content-leave-to"
            >
              <div
                className="position-fixed h-screen bg-white shadow"
                style={{ width: "75vw", maxWidth: "640px" }}
              >
                <div className="h-100">
                  <button
                    className="d-none btn btn-close"
                    ref={closeButton}
                    onClick={() => {
                      setShow(false);
                    }}
                  ></button>
                  {loading ? <CardsLoading /> : null}
                  {link && (
                    <iframe
                      title="link"
                      className="w-100 h-100"
                      src={link}
                      ref={iframeRef}
                    ></iframe>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

async function getWebsitePreview(subdomian) {
  const userRes = await axios.get(apis.getWebsiteDataBySubdomain(subdomian));
  const data = userRes.data;
  return data;
}
