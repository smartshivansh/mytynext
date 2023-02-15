import React from "react";
import Image from "next/image";

import classes from "./Linktype.module.css"

import next from "./assets/group.svg"
import personal from "./assets/Personal.svg";
import bussiness from "./assets/buss.svg"

export default function Linktype(){

  return <div className={classes.container}>
    
    <h1>WHAT TYPE OF LINK YOU WANT</h1>
    
    <div className={classes.imgCont}>
      <Image src={personal}  />
      <Image src={bussiness}  />
    </div>

    <p className={classes.desp}>
    Choose personal: If you want to create a link by your name. <br />
    For example- personal website, portfolio, resume, visiting card etc. <br />

    Choose business: If you want to create a link by your firm or business's name. <br />
    For example- xyzenterprises.myty.in 
    </p>

    <div className={classes.nextIconCont}>
      <Image src={next} className={classes.nextIcon} />
    </div>
  </div>
}