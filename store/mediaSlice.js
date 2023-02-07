import { createSlice } from "@reduxjs/toolkit";
import Plyr from "plyr";
// get video > source > src
const getVideoSrc = (video) => {
  return video.querySelector("source").src;
};

// get iframe > src
const getIframeSrc = (iframe) => {
  return iframe.querySelector("iframe").src;
};

export const mediaSlice = createSlice({
  name: "MEDIAPLAYBACK",
  initialState: {
    currentlyPlayingVideo: null,
  },
  reducers: {
    setCurrentlyPlayingVideo(state, action) {
      state.currentlyPlayingVideo = action.payload;
      const videos = document.querySelectorAll("video");
      // console.log("action.payload.src", action.payload);
      // auto pause  ▶ ☢ YTPlayers  ☢ ◀

      // const YTPlayers = Array.from(document.querySelectorAll("iframe")).map(
      //   (p) => new Plyr(p)
      // );

      const YTPlayers = document.querySelectorAll("iframe");

      // console.log("YTPlayers", YTPlayers);

      // Match the protocol of the of the parent's page
      const protocol =
        window.location.protocol === "https:" ? "https:" : "http:";
      const host = window.location.host;
      const pathname = window.location.pathname;
      const url = `${protocol}//${host}${pathname}`;

      // console.log("url", url);

      // Get a reference to the iframe element
      const iframe = document.querySelectorAll("iframe");
      // Retrieve window object needed for postMessage
      const iframeWindow = iframe.contentWindow;

      // console.log(iframeWindow.postMessage("play"));

      // Send a message to the iframe
      // iframeWindow.postMessage("play", url);

      console.log("iframe", iframe.src);

      YTPlayers.forEach((video) => {
        console.log("video", video.src);
        // video.contentWindow.postMessage(
        //   '{"event":"command","func":"stopVideo","args":""}',
        //   "*"
        // );
        if (iframe.src !== video.src) {
          console.log("Event fire need");
          // iframeWindow.postMessage("pause", url);

          video.contentWindow.postMessage(
            '{"event":"command","func":"stopVideo","args":""}',
            "*"
          );
          // iframe.contentWindow.p
        }
        // if (video.source !== action.payload.src) {
        //   video.pause();
        // }
      });

      videos.forEach((video) => {
        if (getVideoSrc(video) !== action.payload.src) {
          video.pause();
        }
      });
    },
  },
});

export const { setCurrentlyPlayingVideo } = mediaSlice.actions;

export const selectCurrentlyPlayingVideo = (state) =>
  state.media.currentlyPlayingVideo;

export default mediaSlice.reducer;
