import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentlyPlayingVideo,
  setCurrentlyPlayingVideo,
} from "../../../store/mediaSlice";

// import Plyr from "plyr-react";
import Plyr from "plyr";
import options from "./options";

const VideoCardPreview = ({ videoList }) => {
  const { videos } = videoList;
  const currentlyPlayingVideo = useSelector(selectCurrentlyPlayingVideo);
  const dispatch = useDispatch();

  // ▶ ☢ isYoutube  ☢ ◀
  const isYoutube = (url) => {
    return url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gm);
  };

  // ▶ ☢ get getVideoId  ☢ ◀
  const getVideoId = (url) => {
    if (isYoutube(url)) {
      if(/^(https?:\/\/)?(www\.)?youtu\.?be\//.test(url)){
        return url.split('/')[3] ?? url.split('.be/')[1];
      }
      return url.split("v=")[1].substring(0, 11);
    }
  };

  const [videoData, setVideoData] = useState([]);

  // ▶ ☢ useEffect  ☢ ◀
  useEffect(() => {
    setVideoData(videos);
  }, []);

  //  ▶ ☢ useMemo to prevent re-rendering  ☢ ◀
  React.useMemo(() => videoData, [videoData]);

  const players = Array.from(document.querySelectorAll(".js-player")).map(
    (p) => new Plyr(p)
  );

  // ▶ ☢ YTPlayers  ☢ ◀
  const YTPlayers = Array.from(document.querySelectorAll(".youtube")).map(
    (p) => new Plyr(p)
  );

  window.Plyr = players;
  window.Plyr = YTPlayers;

  // get video > source > src
  const getVideoSrc = (video) => {
    return video.querySelector("source").src;
  };

  // get iframe > src
  const getIframeSrc = (iframe) => {
    return iframe.querySelector("iframe").src;
  };

  // ▶ ☢  auto pause other videos  ☢ ◀
  const onPlayHandler = (event) => {
    // console.log("onPlayHandler", getVideoSrc(event.target));
    // players.forEach((player) => {
    //   if (event.target === getVideoSrc(event.target)) {
    //     player.play();
    //   } else {
    //     players.every((player) => player.pause());
    //   }
    // });
  };

  YTPlayers.forEach((player) => {
    player.on("play", (event) => {
      // console.log("onPlayHandler", getIframeSrc(event.target));

      dispatch(setCurrentlyPlayingVideo(getIframeSrc(event.currentTarget)));
    });
  });

  return (
    <div className="mb-2">
      {videoData &&
        videoData.map((data, key) => (
          <div key={key}>
            {isYoutube(data.src) ? (
              <div
                className="youtube"
                data-plyr-provider="youtube"
                data-plyr-embed-id={getVideoId(data.src)}
                data-plyr-config={JSON.stringify({
                  ...options,
                  youtube: {
                    origin: window.location.origin,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0,
                    encodeURI: true,
                    enablejsapi: 1,
                  },
                })}
                onPlay={(event) => {
                  dispatch(setCurrentlyPlayingVideo(data));
                  console.log("onPlayHandler", data);
                }}
              ></div>
            ) : (
              <video
                onPlay={(event) => {
                  onPlayHandler(event);
                  dispatch(setCurrentlyPlayingVideo(data));
                }}
                className="js-player"
                playsInline
                controls
                data-poster={data.poster}
                data-plyr-config={JSON.stringify(options)}
              >
                <source src={data.src} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
    </div>
  );
};

export default VideoCardPreview;
