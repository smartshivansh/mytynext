import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import apis from '../pages/home/constants/apis';

export const SearchSlice = createSlice({
  name: 'search',
  initialState: {
    searchFeeds: null,
    searchSuggestion: null,
    suggestionLoading: null,
    searchLoading: false,
    searchError: '',
  },
  reducers: {
    setSearchData: (state, actions) => {
      state.searchFeeds = actions.payload;
    },
    setSearchSuggestionData: (state, actions) => {
      state.searchSuggestion = actions.payload;
    },
    setLoading: (state, actions) => {
      state.searchLoading = actions.payload;
    },
    setSuggestionLoading: (state, actions) => {
      state.suggestionLoading = actions.payload;
    },
    seterror: (state, actions) => {
      state.searchError = actions.payload;
    },
    searchCleanup: (state, actions) => {
      state.searchFeeds = null;
    },
    searchSuggestionCleanup: (state, actions) => {
      console.log('searchSuggestionCleanup Ran');
      state.searchSuggestion = null;
    },
  },
});

export const {
  setSearchData,
  setSearchSuggestionData,
  setLoading,
  setSuggestionLoading,
  seterror,
  searchCleanup,
  searchSuggestionCleanup,
} = SearchSlice.actions;

export const setSearchDataAsync = (query) => async (dispatch) => {
  if (!query) {
    dispatch(setLoading(true));
    dispatch(seterror(''));
    dispatch(setSearchData(null));
    dispatch(setLoading(false));

    return;
  }

  dispatch(seterror(''));
  dispatch(setLoading(true));
  // console.log("query ", query);

  try {
    // const { data } = await axios.post(`/api/search`, { query });
    const { data } = await axios.post(apis.searchResults, { query });

    // console.log("data that need to come ", data?.results);
    if (!data?.results?.blog.length) {
      dispatch(
        seterror(
          'We have no match for your keyword but we bring some suggestions '
        )
      );
      setTimeout(() => {
        dispatch(seterror(''));
      }, 3000);
    }
    dispatch(setSearchData(data?.results?.blog));
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(seterror("no results found, try something else"));
    // dispatch(seterror(err.message));
    console.log(err)
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(seterror(''));
    }, 2000);
  } finally {
    dispatch(setLoading(false));
  }
};

export const setSearchSuggestionDataAsync = (query) => async (dispatch) => {
  if (!query) {
    dispatch(setSuggestionLoading(true));
    dispatch(seterror(''));
    dispatch(setSearchData(null));
    dispatch(setSuggestionLoading(false));

    return;
  }

  dispatch(seterror(''));
  dispatch(setSuggestionLoading(true));
  // console.log("query ", query);

  try {
    // const { data } = await axios.post(`/api/search`, { query });
    const { data } = await axios.post(apis.searchSuggestionResults, { query });

    // console.log('data that need to come ', data);
    if (!data?.results?.length) {
      dispatch(
        seterror(
          'We have no match for your keyword but we bring some suggestions'
        )
      );
      dispatch(setSearchSuggestionData(null));
      setTimeout(() => {
        dispatch(seterror(''));
      }, 3000);
      return;
    }
    dispatch(setSearchSuggestionData(data?.results));
    dispatch(setSuggestionLoading(false));
  } catch (err) {
    dispatch(seterror(err.message));
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(seterror(''));
    }, 2000);
  } finally {
    dispatch(setSuggestionLoading(false));
  }
};

export default SearchSlice.reducer;
