module.exports = (name) => {
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
                #start {
                    line-height: 30px;
                    font-size: 20px;
                    display: block;
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
                .msg {
                    margin-left: 70px;
                    padding-top: 80px;
                    font-size: 16px;
                }
                p , li{
                    width: 75%;
                }
                ol {
                    padding-left: 20px;
                    margin-top: 40px;
                }
                footer {
                    margin-left: 70px;
                    margin-top: 17%;
                    padding-bottom: 5%;
                    font-weight: 300;
                }
                li a {
                    color: blue;
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
                        <p id="start">Dear ${name},</p>
                        <p>We are thrilled to have you onboard. </p>
                        <p>Here’s some important information about Myty. Please save this email so you can refer to it later.</p>
                        <ol>
                            <li>Now you have everything you need to build a successful web presence. Kindy use Myty on your PC to make the most of it.</li>
                            <li>You will be added to our official communication channel on WhatsApp, where you can share your experience and feedback about the product.</li>
                            <li>You can also join the channel using <a href="https://chat.whatsapp.com/DzSwMofWVLO9Noe94tE72b">this link.</a></li>
                            <li>You can find out more about this in our FAQ section here <a href="https://myty.in/faqs">myty.in/faqs.</a></li>
                        </ol>
                    </div>
                    <footer>In case of any queries, please mail us at <a class="link" href="mailto: care@myty.in">care@myty.in</a></footer>
                </div>
            </main>
        </body>
    </html>`;
};
