const express = require("express");
const {
  queryCollection,
  queryImageCollection,
  queryMultiCollection,
  queryMultiCollectionForSuggestion,
  createBlogCollection,
  createImageCollection,
  createVideoCollection,
  createQuoteCollection,
  deleteCollection,
  retrive,
} = require("../../../utils/typesense/actions");

const router = express.Router();

router.post("/", async (req, res) => {
  // const isHostMytym = hostIsMytym(req.hostname);
  // if (!isHostMytym) {
  //   console.log('requesting for data to mytym search server');
  //   const response = await axios.post('https://mytym.in/api/search', req.body);
  //   res.status(200).send(response.data);
  //   return;
  // }

  const { query } = req.body;

  queryMultiCollection(query)
    .then((results) => {
      if (results.results.blog.length > 0) {
        res.status(200).send(results);
      }
      // else {
      //   queryMultiCollection(query, true)
      //     .then((results) => {
      //       res.status(200).send(results);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/suggestion", async (req, res) => {
  // const isHostMytym = hostIsMytym(req.hostname);
  // if (!isHostMytym) {
  //   console.log('requesting for data to mytym search server');
  //   const response = await axios.post(
  //     'https://mytym.in/api/search/suggestion',
  //     req.body
  //   );
  //   res.status(200).send(response.data);
  //   return;
  // }

  const { query } = req.body;
  console.log("this ran in the server ---> ", query);
  queryMultiCollectionForSuggestion(query)
    .then((results) => {
      if (results.results.length > 0) {
        res.status(200).send(results);
      } else {
        queryMultiCollectionForSuggestion(query, true)
          .then((results) => {
            res.status(200).send(results);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/createCollections", async (req, res) => {
  try {
    deleteCollection("image");
    deleteCollection("blogs");
    deleteCollection("video");
    deleteCollection("quote");

    createBlogCollection();
    createImageCollection();
    createQuoteCollection();
    createVideoCollection();
  } catch (error) {
    console.log("CreateCollections", error);
  }

  res.sendStatus(200);
});

router.get("/listCollections", async (req, res) => {
  try {
    res.send(await retrive());
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/deleteCollections", async (req, res) => {
  try {
    deleteCollection("blogs");
    deleteCollection("image");
    deleteCollection("quote");
    deleteCollection("video");
  } catch (error) {
    console.log("DeleteCollection Error", error);
  }

  res.sendStatus(200);
});

// Utils
function hostIsMytym(hostname) {
  console.log("\nHOSTNAME", hostname);
  if (hostname === "mytym.in" || hostname === "www.mytym.in") {
    return true;
  }

  console.log("is not mytym");
  return false;
}

module.exports = router;
