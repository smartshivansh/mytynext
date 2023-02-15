module.exports = (otp) => {
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
                    margin: 10px auto;
                    padding-left: 5px;
                    border-bottom: 2px solid #FFC700;
                }
                span {
                    line-height: 30px;
                    font-size: 20px;
                    display: block;
                    padding-bottom: 10px;
                }
                .box {
                    width: 95%;
                    min-height: 75vh;
                    margin-top: 1em;
                    font-size: 16px;
                    background-color: #f5f5f5;
                    margin-left: 8%;
                    border-top-left-radius: 2em;
                    box-shadow: -2px -2px 20px rgba(0, 0, 0, 0.1);
                }
                #abv-code {
                    margin-bottom: 35px;
                }
                #blw-code {
                    margin-top: 35px;
                }
                strong {
                    font-size: 24px;
                    font-weight: 500;
                }
                .msg {
                    margin-left: 70px;
                    padding-top: 80px;
                }
                footer {
                    margin-left: 70px;
                    margin-top: 30%;
                    padding-bottom: 5%;
                }
                a {
                    text-decoration: none;
                    color: black;
                }
                a:hover {
                    text-decoration: underline;
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
                        <p id="abv-code"><span>Dear user, </span> To authenticate, please use the following One Time Password (OTP):</p>
                        <strong>${otp}</strong>
                        <p id="blw-code">Do not share this OTP with anyone.</p>
                    </div>
                    <footer>In case of any queries, please mail us at <a href="mailto: happytohelp@doions.com">happytohelp@doions.com</a></footer>
                </div>
            </main>
        </body>
        
    </html>`;
};
