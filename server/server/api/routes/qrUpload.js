var wget = require("node-wget");
const download = require("../../../");
const multer = require("multer");
const path = require("path");
const express = require("express");
const server = require("../../../server");
const router = express.Router();

router.post("/", (req, res) => {
  // console.log("path.join", path.join(__dirname, "../", `${server.Url}/`));
  // console.log("path.join", path.join(__dirname, "../", `${server.Url}/`));
  // console.log(
  //   "path.join",
  //   path.join(`${__dirname}/../uploads/5a13f4e9ed012975138c87b9130ccb21.svg`)
  // );
  // res.sendFile(
  //   path.join(
  //     `${__dirname}/../../../uploads/5a13f4e9ed012975138c87b9130ccb21.svg`
  //   )
  // );
  const qrUrl = req.body.url;
  wget(
    {
      url: `https:${qrUrl}`,
      dest: "uploads/",
      timeout: 2000,
    },
    function (err, data) {
      if (err) {
        sconsole.log("error did not save svg", err);
      }
      console.log(data); // '/tmp/package.json'
      console.log("file path ", `${server.Url}/${data.filepath}`);
      res.sendFile(path.join(`${__dirname}/../../../${data.filepath}`));
    }
  );
});

module.exports = router;
