import apis from '@/pages/home/constants/apis';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: {
    feeds: null,
    adminfeed: [],
    newLoading: false,
    loading: false,
    error: '',
  },
  reducers: {
    setFeedData: (state, actions) => {
      state.feeds = actions.payload;
    },
    setNewFeedData: (state, actions) => {
      state.feeds = [...state.feeds, ...actions.payload];
    },
    setAdminFeedData: (state, actions) => {
      state.adminfeed = actions.payload;
    },
    setNewAdminFeedData: (state, actions) => {
      state.adminfeed = [state.adminfeed, ...actions.payload];
    },

    setLoading: (state, actions) => {
      state.loading = actions.payload;
    },
    seterror: (state, actions) => {
      state.error = actions.payload;
      state.loading = false;
    },
    newLoading: (state, actions) => {
      state.newLoading = actions.payload;
    },
    feedsCleanup: (state, actions) => {
      state.feeds = null;
    },
  },
});

export const {
  setFeedData,
  setNewFeedData,
  loading,
  setLoading,
  newfeeds,
  seterror,
  newLoading,
  setAdminFeedData,
  setNewAdminFeedData,
  feedsCleanup,
} = feedsSlice.actions;

export const setFeedDataAsync = (feedData) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { data } = await axios.post(apis.feeds, feedData);

    // console.log("data in setFeedDataAsync", data);

    dispatch(setFeedData(data));
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(seterror(err.message));
    setTimeout(() => {
      dispatch(seterror(''));
    }, 2000);
  }
};

export const setNewFeedDataAsync = (feedData) => async (dispatch) => {
  try {
    dispatch(newLoading(true));
    const { data } = await axios.post(apis.feeds, feedData);
    // console.log("data in setNewFeedDataAsync", data);

    dispatch(setNewFeedData(data));
    dispatch(newLoading(false));
  } catch (err) {
    dispatch(seterror(err.message));
  }
};

export const setAdminFeedDataAsync = (feedData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.post(apis.fullFeeds, feedData);

    const dataToSort = [
      ...data.results.blog,
      ...data.results.image,
      ...data.results.video,
      ...data.results.quote,
      ...data.results.link,
    ];

    // sortReverseChronologic(dataToSort);
    dispatch(setAdminFeedData(dataToSort));
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(seterror(err.message));
    setTimeout(() => {
      dispatch(seterror(''));
    }, 2000);
  }
};

export const setNewAdminFeedDataAsync = (feedData) => async (dispatch) => {
  try {
    dispatch(newLoading(true));
    const { data } = await axios.post(apis.fullFeeds, feedData);

    const dataToSort = [
      ...data.results.blog,
      ...data.results.image,
      ...data.results.video,
      ...data.results.quote,
      ...data.results.link,
    ];

    // sortReverseChronologic(dataToSort);
    dispatch(setNewAdminFeedData(dataToSort));
    dispatch(newLoading(false));
  } catch (err) {
    dispatch(seterror(err.message));
    setTimeout(() => {
      dispatch(seterror(''));
    }, 2000);
  }
};

export const searchFeedDataAsync = (feedData) => async (dispatch) => {
  console.log('setNewFeedDataAsync inside reduxSlice', feedData);
  // try {
  //   dispatch(newLoading(true));
  //   const { data } = await axios.post(apis.feeds, feedData);

  //   const dataToSort = [
  //     ...data.results.blog,
  //     ...data.results.image,
  //     ...data.results.video,
  //     ...data.results.quote,
  //     ...data.results.link,
  //   ];

  //   sortReverseChronologic(dataToSort);
  //   dispatch(setNewFeedData(dataToSort));
  //   dispatch(newLoading(false));
  // } catch (err) {
  //   dispatch(seterror(err.message));
  // }
};

export default feedsSlice.reducer;
