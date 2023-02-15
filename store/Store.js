import {configureStore} from "@reduxjs/toolkit";
import feedsReducer from "./feedsSlice";
import searchReducer from "./SearchSlice"
import mediaReducer from "./mediaSlice";

const store = configureStore({reducer:{
    search: searchReducer,
    feeds: feedsReducer,
    media: mediaReducer
}})

export default store;