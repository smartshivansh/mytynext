import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { useSelector, useDispatch } from "react-redux";
// import { selectAuthed, setAuthState } from "../../store/authSlice";
// import { ReactComponent as LoginIcon } from "bootstrap-icons/icons/box-arrow-in-right.svg";
// import { ReactComponent as LogoutIcon } from "bootstrap-icons/icons/box-arrow-right.svg";
import axios from "axios";


export default function AuthButtons() {
 
  // const navigate = useNavigate();

  const validatePreviousSession = () => {
    let token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          "/api/refresh-token",
          {},
          {
            headers: {
              "x-auth-token": token,
            },
          }
        )
        .then((res) => {
          token = res.data.token;
          localStorage.setItem("token", token);
          // navigate("/admin/dashboard");
        })
        .catch((err) => {
          // navigate("/login");
        });
    } else {
      // navigate("/login");
    }
  };

  return (
    <div>
      
      <div className="p-2 p-md-0 bg-white d-flex flex-column flex-md-row justify-content-end align-items-stretch">
        <Link
          className="d-block btn text-decoration-none btn-brand-primary border-2 mb-2 mb-md-0 px-3 text-dark fw-normal"
          onClick={validatePreviousSession}
          href="/login"
        >
          <span className="">Log in</span>
        </Link>
        <Link
          href="/signup"
          className="d-block btn text-decoration-none btn-outline-brand-primary border-2 ms-0 ms-md-2 px-3 text-dark fw-normal"
          onClick={() => {
            localStorage.removeItem("trial");
            localStorage.removeItem("progress");
          }}
        >
          <span className="">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
