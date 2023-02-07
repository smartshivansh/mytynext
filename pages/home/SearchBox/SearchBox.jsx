import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchDataAsync,
  setSearchSuggestionDataAsync,
} from "../../../store/SearchSlice";
import debounce from "lodash.debounce";
import { useLocation } from "react-router";
import routes from "../constants/routes";
import { Combobox } from "@headlessui/react";


import { Router } from "react-router"


export default function SearchBox({ queryParam }) {
  // let { pathname } = useLocation() ? useLocation(): false;
  let pathname = true;


  const dispatch = useDispatch();
  const { searchSuggestion, suggestionLoading } = useSelector(
    (state) => state.search
  );

  const [input, setInput] = useState("");
  const query = useRef("");

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [backSpace, setBackSpace] = useState(false);

  useEffect(() => {
    if (queryParam) {
      // console.log("search with ", queryParam);
      query.current = queryParam;
      dispatch(setSearchDataAsync(query.current));
    } else {
      // console.log("No search");
    }
  }, [queryParam]);

  const debouncedChangeHandler = useCallback(
    debounce((input) => {
      // console.log(" inside debounce  ", query.current);
      dispatch(setSearchSuggestionDataAsync(query.current));
    }, 1000),
    [query.current]
  );

  function handleClick() {
    dispatch(setSearchDataAsync(query.current));
  }


  const handleKey = (event) => {
    console.log("inputvalur", event.target.value);
    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("backspace pressed");
      setBackSpace(true);
    }

    if (event.key === "Enter") {
      setBackSpace(false);
      setSelectedValue(inputValue);
      dispatch(setSearchDataAsync(inputValue));
    }
  };

  const debounceQuery = useCallback(
    debounce((_input) => {
      dispatch(setSearchSuggestionDataAsync(_input));
    }, 1000),
    []
  );

  useEffect(() => {
    debounceQuery(inputValue);
  }, [inputValue, debounceQuery]);

  return (
    <Router>
      {(pathname === routes.feeds ||
        pathname === routes.explore ||
        pathname === routes.index) && (
        <div className="mb-4">
          <Combobox
            value={selectedValue}
            onChange={(e) => {
              console.log("inside combobox", e);
              if (!backSpace) {
                console.log("inside combobox if backspace is false", backSpace);
                setInputValue(e);
                setSelectedValue(e);
                dispatch(setSearchDataAsync(e));
              }
            }}
            onKeyUp={handleKey}
          >
            <div className="d-flex ">
              <div className="w-100">
                <div className="form-control rounded-3 border-2 d-flex align-items-center">
                  <Combobox.Input
                    className="form-control border-0 ps-4"
                    placeholder="Search anything..."
                    autoComplete="off"
                    displayValue={inputValue}
                    onChange={(e) => {
                      // console.log('inside combobox input', e);
                      setInputValue(e.target.value);
                    }}
                    // onKeyUp={handleKey}
                  />

                  <button
                    className={`btn ${selectedValue ? "invisible" : ""}`}
                    onClick={() => {
                      // setSelectedValue(inputValue);
                      dispatch(setSearchDataAsync(inputValue));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>

                  {selectedValue ? (
                    <button
                      className="p-0 btn"
                      onClick={() => {
                        setSelectedValue("");
                        dispatch(setSearchDataAsync(""));
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-x-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {searchSuggestion?.length && (
                  <Combobox.Options
                    className="dataResult"
                    unmount={isUnmounted}
                  >
                    {searchSuggestion?.map((result, key) => (
                      <Combobox.Option
                        key={key}
                        className="list-unstyled"
                        value={result.replace(/(<([^>]+)>)/gi, "")}
                      >
                        {({ selected, active }) => (
                          <>
                            <button
                              className={
                                " border-0 w-100 text-start dataItem py-2 ps-2 " +
                                (active
                                  ? " bg-brand-lightgrey border-start border-2 border-brand-primary "
                                  : " bg-white ")
                              }
                              dangerouslySetInnerHTML={{
                                __html: result,
                              }}
                              onClick={() => {
                                const _input = result.replace(
                                  /(<([^>]+)>)/gi,
                                  ""
                                );
                                setSelectedValue(_input);
                                dispatch(setSearchDataAsync(_input));
                                setIsUnmounted(true);
                              }}
                            ></button>
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </div>
          </Combobox>
        </div>
      )}

     
    </Router>
  );
}
