import {useState} from "react";

import axios from "axios";

import classes from "./linkpage.module.css";

import PlayBtn from "./assets/playCircle.svg"

import apis from "../constants/api"


export default function PersonalLink() {

    const [subdomain, setSubdomain] = useState("");
    const [error, setError] = useState("");
    const [errorColor, setErrorColor] = useState({color: "black"});

    function subdomainHandler(e){
        setSubdomain(p => e.target.value);
    }

    async function checkAvailabilityHandler(){
      
       await  fetch(`${apis.subDomainCheck}`, {
            method: "POST",
            body: JSON.stringify({subdomain}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res)
            res = res.json();
            // res = JSON.parse(res);
            return res;
        }).then(data => {

            if(data.sucess){
                setError(p => "Available")
                setErrorColor(p => "green")
            }
            else if(!data.sucess){
                setError(p => "Not Available")
                setErrorColor(p => "red")
            }
        })

    }





    return <div className={classes.container}>

        <div className={classes.videoContainer}>

           <div className={classes.videoPlayer}>
              <div src={PlayBtn} className={classes.playBtn}></div>
           </div>

           <p className={classes.desp}>
              Lorem ipsum dolor sit amet consectetur. Augue at feugiat ac nullam. Faucibus vestibulum tortor in gravida at aenean urna aliquam. Faucibus massa arcu semper quis sed pretium varius. Ipsum leo a a maecenas dui blandit bibendum sit.
           </p>

        </div>

        <div className={classes.username}>
            <div className={classes.heading}>
            <span className={classes.booklink}>BOOK YOUR MYTY LINK</span>
            <span className={classes.linksep}>&nbsp;/&nbsp;</span>
            <span className={classes.booklink}>BEFORE SOMEONE ELSE</span>
            </div>

            <form className={classes.formCont}>
                <p className={classes.formHeading}>Search and buy available domain names</p>
                <section className={classes.inputcont}>
                    <input type="text" className={classes.textInput} placeholder="Type preferred link" onChange={subdomainHandler} value={subdomain} />
                    <button type="button" className={classes.submitInput} placeholder="Search" onClick={checkAvailabilityHandler}>Search</button>
                </section>
                <p className={classes.formHeading}>Only lowercase alphanumeric hyphens and underscores are allowed.</p>
                <p className={classes.error} style={{color: `${errorColor}`}}>{error}</p>
                <input type="submit" value="Book Myty Link" className={classes.submitBtn} />
            </form>
        </div>

   </div>
}