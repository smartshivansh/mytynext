import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../assets/logo.png";
import MenuIcon from "bootstrap-icons/icons/list.svg";
import CrossIcon from "bootstrap-icons/icons/x-square.svg";
import AccountIcon from "../../../assets/account.svg";
import AuthButtons from "./AuthButtons";
import { Popover } from "react-tiny-popover";

import classes from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <div className="bg-white">
      <nav className="navbar">
        {/* <div className="container d-flex flex-row justify-content-between align-items-center"> */}
        <div className="container row mx-auto">
          <div className="px-0 col-4">
            <div className="d-block d-md-none">
              <Popover
                isOpen={menuOpen}
                positions={["bottom"]}
                containerStyle={{ zIndex: 10, paddingLeft: "2rem" }}
                content={<MenuLinks />}
              >
                <button
                  className="btn"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                  }}
                >
                  {menuOpen ? (
                    <Image src={CrossIcon} className="xl-icon" />
                  ) : (
                    <Image src={MenuIcon} className="xl-icon" />
                  )}
                </button>
              </Popover>
            </div>
          </div>
          <div className="px-0 col-4 my-4">
            <div className="text-center">
              <Link href="/" className="text-dark  text-decoration-none">
                <img
                  className="img-fluid"
                  style={{ maxHeight: "64px" }}
                  src={logo}
                  alt=""
                />
              </Link>
            </div>
          </div>
          <div className="px-0 col-4">
            <div className="d-block d-md-none text-end">
              <Popover
                isOpen={accountOpen}
                positions={["bottom"]}
                containerStyle={{ zIndex: 10, paddingRight: "2rem" }}
                content={
                  <div className="border">
                    <AuthButtons />
                  </div>
                }
              >
                <button
                  className="btn"
                  onClick={() => {
                    setAccountOpen(!accountOpen);
                  }}
                >
                  <Image src={AccountIcon} className="xl-icon" />
                </button>
              </Popover>
            </div>
            <div className=" d-none d-md-block text-end">
              <AuthButtons />
            </div>
          </div>
        </div>
      </nav>
      <div className="container text-center py-3 d-none d-md-block">

        <Link
          activeClassName={`classes.navbar__link--active`}
          className={classes.navbar__link}
          href="/about"
        >
          About
        </Link>

        <Link
          activeClassName={`classes.navbar__link--active`}
          className={classes.navbar__link}
          href="/pricing"
        >
          Pricing
        </Link>

        <Link
          activeClassName={`classes.navbar__link--active`}
          className={classes.navbar__link}
          href="/faqs"
        >
          FAQs
        </Link>

        <a
          href={`http://myty-blog.${process.env.REACT_APP_NAME}`}
          target="_blank"
          rel="noreferrer noopener"
          className={classes.navbar__link}
        >
          Blog
        </a>

        <Link
          activeClassName={`classes.navbar__link--active`}
          className={classes.navbar__link}
          href="/help-support"
        >
          Help & Support
        </Link>
      </div>
    </div>
  );
}

function MenuLinks() {
  return (
    <div className="bg-white">
      <Link
        activeClassName={`classes.navbar__link_mobile--active`}
        className={classes.navbar__link_mobile}
        to="/about"
      >
        About
      </Link>

      <Link
        activeClassName={`classes.navbar__link_mobile--active`}
        className={classes.navbar__link_mobile}
        href="/pricing"
      >
        Pricing
      </Link>

      <Link
        activeClassName={`classes.navbar__link_mobile--active`}
        className={classes.navbar__link_mobile}
        href="/faqs"
      >
        FAQs
      </Link>

      <a
        href={`http://myty-blog.${process.env.REACT_APP_NAME}`}
        target="_blank"
        rel="noreferrer noopener"
        className="classes.navbar__link_mobile"
      >
        Blog
      </a>

      <Link
        activeClassName={`classes.navbar__link_mobile--active`}
        className={classes.navbar__link_mobile}
        href="/help-support"
      >
        Help & Support
      </Link>
    </div>
  );
}
