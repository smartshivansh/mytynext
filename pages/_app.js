// import '@/styles/globals.css'

import { Provider } from "react-redux"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import store from "../store/Store"

import "bootstrap/dist/css/bootstrap.min.css"

export default function App({ Component, pageProps }) {
  return <Provider store={store}>
  <Component {...pageProps} />
</Provider>
               
             
}
