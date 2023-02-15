const express = require("express");
const auth = require("../../../../middleware/auth");
const Pages = require("../../../../models/PagesSchema");
const router = express.Router();

router.post("/post/newpage", auth, async (request, response) => {
  const { pageData } = request.body;

  const result = await Pages(pageData).save();

  response.send({
    message: "posted new page",
    pageData,
    result,
  });
});

router.put("/put/page/:page_id", auth, async (request, response) => {
  const { page_id } = request.params;

  const { pageData } = request.body;

  const resultPage = await Pages.findByIdAndUpdate(page_id, pageData, {
    new: true,
  });
  // console.log(resultPage);

  response.send({
    message: "putting new data",
    result: resultPage,
  });
});

router.delete("/delete/page/:page_id", auth, async (request, response) => {
  const { page_id } = request.params;

  const resultDeletedPage = await Pages.findByIdAndRemove(page_id);
  const user_id = resultDeletedPage.user_id;
  const resultOtherPages = await Pages.find({ user_id });

  response.send({
    message: "deleting page",
    result: resultOtherPages,
  });
});

router.get("/get/allpages/:user_id", auth, async (request, response) => {
  const { user_id } = request.params;

  if (user_id) {
    const resultPages = await Pages.find({ user_id });

    response.send({
      message: "getting all pages for",
      user_id,
      result: resultPages,
    });
  } else {
    res.send(null);
  }
});

// ! This maybe done with id instead of slug
// router.get("/get/:user_id/:page_slug", async (request, response) => {
router.get("/get/:user_id/:page_slug", async (request, response) => {
  const { user_id, page_slug } = request.params;

  const result = await Pages.findOne({ user_id, slug: page_slug });

  response.send({
    message: "getting page with",
    result,
  });
});

module.exports = router;
