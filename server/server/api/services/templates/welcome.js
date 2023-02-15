module.exports = () => {
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
                #start {
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
                .msg {
                    margin-left: 70px;
                    padding-top: 80px;
                }
                footer {
                    margin-left: 70px;
                    margin-top: 20%;
                    padding-bottom: 5%;
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
                        <p id="start">Dear user,</p>
                        <p>Thank you for your interest in Myty Beta User Program!</p>
                        <p>We've received your application and currently reviewing it. Once it is approved you will receive an invite code on this e-mail. You can then use that code to sign-up into your Myty account. Kindly check this space for more updates.</p>
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
