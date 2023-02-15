
import classes from "./BookLinkForm.module.css"

export default function BookLinkForm(){

    return <div className={classes.container}>
        <form className={classes.form}>
        <h1 className={classes.heading}>BOOK YOUR MYTY LINK</h1>
        <input type="text" className={classes.input} placeholder="Name" />
        <input type="email" className={classes.input} placeholder="E-mail" />
        <input type="tel" className={classes.input} placeholder="Phone number" />
        <input type="submit" className={classes.submitBtn} value="Book Now" />
    </form>
    </div>
}