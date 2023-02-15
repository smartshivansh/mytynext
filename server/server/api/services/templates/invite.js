module.exports = (name, code) => {
	return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Poppins';
                    font-weight: 400;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    line-height: 24px;
                    letter-spacing: 0.3px;
                }
                main {
                    border: 1px solid black;
                    border-radius: .5em;
                    min-height: 75vh;
                    width: 80%;
                    margin: auto;
                    overflow: scroll;
                }
                h1 {
                    text-align: center;
                    width: fit-content;
                    font-weight: 600;
                    margin: 13px auto;
                    padding-left: 5px;
                    border-bottom: 2px solid #FFC700;
                }
                span {
                    line-height: 30px;
                    font-size: 20px;
                    display: block;
                    padding-bottom: 10px;
                }
                p {
                    width: 75%;
                }
                .box {
                    width: 95%;
                    min-height: 75vh;
                    margin-top: 2.3%;
                    font-size: 16px;
                    background-color: #f5f5f5;
                    margin-left: 8%;
                    border-top-left-radius: 2em;
                    box-shadow: -2px -2px 20px rgba(0, 0, 0, 0.1);
                }
                strong {
                    font-size: 24px;
                    font-weight: 500;
                }
                .msg {
                    margin-left: 70px;
                    padding-top: 80px;
                }
                .btn {
                    background-color: #EB6C6C;
                    color: white;
                    font-weight: 500;
                    font-size: 1.2em;
                    margin-top: 20px;
                    padding: 15px 20px;
                    border-radius: 0.5em;
                    text-decoration: none;
                }
                footer {
                    margin-left: 70px;
                    margin-top: 15%;
                    padding-bottom: 5%;
                }
                .abv-code {
                    margin-bottom: 35px;
                }
                .blw-code {
                    margin-top: 35px;
                    margin-bottom: 30px;
                }
                a {
                    text-decoration: none;
                    color: black;
                }
                .link:hover {
                    text-decoration: underline;
                }
                #sec-lst {
                    font-size: 0.9em;
                }
                #lst {
                    font-weight: 300;
                    font-size: 0.9em;
                }
                @media (max-width: 500px) {
                    h1 {
                        font-size: 1.5em;
                    }
                }
            </style>
        </head>
        <body>
            <main>
                <h1>Hi, Welcome to myty</h1>
                <div class="box">
                    <div class="msg">
                        <p><span>Dear ${name}, </span> Congratulations ! You have been selected for the Myty Beta-user program.</p>
                        <p>Explore the platform that gives you the freedom to build and design your web presence exactly the way you want.</p>
                        <p class="abv-code">To enter the Beta user program, use this one time invite code.</p>
                        <strong>${code}</strong>
                        <p class="blw-code">Enter this code during Sign-up or click on the button below </p>
                        <a href="https://myty.in/signup" class="btn">Get Started</a>
                    </div>
                    <footer>
                        <p>For more information visit <a class="link" href="https://www.myty.in">www.myty.in</a></p>
                        <p id="sec-lst">Please do not reply to this email.</p>
                        <p id="lst">Our Customer Care Team is available 24/7. If you have any questions, please write us on <a class="link" href="mailto: care@myty.in">care@myty.in</a></p>
                    </footer>
                </div>
            </main>
        </body>
        
    </html>`;
};
