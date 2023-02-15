const express = require("express");

const router = express.Router();
const auth = require("../../../../middleware/auth");
const BlogSchema = require("../../../../models/BlogSchema");

const Blog = require("../../../../models/BlogSchema");
const User = require("../../../../models/User");

//from rich text editor
router.post("/newblogpost", auth, async (req, res) => {
  const { user, body } = req;
  const _user = await User.findById(user.id);
  // console.log(await _user);
  // const blog = await new Blog({
  //   user_id: _user._id,
  //   username: _user.username,
  //   user_fullname: _user.name,
  //   title: body.title,
  //   slug: body.slug,
  //   content_raw: body.content_raw,
  //   last_update_date: new Date(),
  //   last_update_date_string: new Date().toDateString(),
  //   drafted: false,
  //   published: true,
  // });

  // blog
  //   .save()
  //   .then((value) => {
  //     res.send({
  //       msg: "blog posted successfully",
  //       result: value,
  //     });
  //   })
  //   .catch((err) => {
  //     if (err) {
  //       console.log(err);
  //       res.send({
  //         msg: "some error occured.",
  //       });
  //     }
  //   });
  const _blog = {
    user_id: _user._id,
    username: _user.username,
    user_fullname: _user.name,
    title: body.title,
    slug: body.slug,
    preview_image: body.previewImage,
    content_raw: body.content_raw,
    last_update_date: new Date(),
    last_update_date_string: new Date().toDateString(),
    drafted: false,
    published: true,
  };

  if (body.id === null) {
    // console.log("Null Id, Create new Entry");
    const blog = await Blog(_blog);
    blog
      .save()
      .then((value) => {
        res.send({
          msg: "blog saved as draft successfully",
          result: value,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          res.send({
            msg: "some error occured.",
          });
        }
      });
  } else {
    // console.log("Id found, Edit Entry");
    Blog.findOneAndUpdate({ _id: body.id }, _blog)
      .then((value) => {
        res.send({
          msg: "blog saved as draft successfully",
          result: value,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          res.send({
            msg: "some error occured.",
          });
        }
      });
  }
});

// !! Drafting Published blogs may give Topology Destroy
// Need to check this
router.post("/newdraftpost", auth, async (req, res) => {
  const { user, body } = req;
  const _user = await User.findById(user.id);
  // console.log(await _user)

  console.log(body.previewImage);

  const _blog = {
    user_id: _user._id,
    username: _user.username,
    user_fullname: _user.name,
    title: body.title,
    slug: body.slug,
    preview_image: body.previewImage,
    content_raw: body.content_raw,
    last_update_date: new Date(),
    last_update_date_string: new Date().toDateString(),
    drafted: true,
    published: false,
  };

  // console.log(body);
  if (body.id === null) {
    // console.log("Null Id, Create new Entry");
    const blog = await Blog(_blog);
    blog
      .save()
      .then((value) => {
        res.send({
          msg: "blog saved as draft successfully",
          result: value,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          res.send({
            msg: "some error occured.",
          });
        }
      });
  } else {
    // console.log(body.id);
    // console.log("Id found, Edit Entry");
    Blog.findOneAndUpdate({ _id: body.id }, _blog)
      .then((value) => {
        res.send({
          msg: "blog saved as draft successfully",
          result: value,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          res.send({
            msg: "some error occured.",
          });
        }
      });
  }
});

router.get("/getblog/:blog_id", async (req, res) => {
  const { blog_id } = req.params;
  const resultBlog = await Blog.findById(blog_id);
  res.send({
    msg: `getting Blog of id ${blog_id}`,
    result: resultBlog,
  });
});

router.get("/getblogs/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  // console.log(user_id);

  const result = await BlogSchema.find({ user_id: user_id, published: true });

  res.send({
    msg: "blogs retrieved successfully.",
    result: result,
  });
});

router.get("/getdrafts/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  // console.log(user_id);

  const result = await BlogSchema.find({ user_id: user_id, drafted: true });

  res.send({
    msg: "drafts retrieved successfully.",
    result: result,
  });
});

router.get("/getblog/:username/:blog_slug", async (req, res) => {
  // console.log("Request to /api/blog/getblog");
  let { username, blog_slug } = req.params;
  // console.log(username);
  // console.log(blog_slug);

  const result = await Blog.find({ username: username, slug: blog_slug });

  res.send({
    msg: "blog retrieved successfully.",
    result: result,
  });
});

router.delete("/deleteblog/:blog_id", async (req, res) => {
  const { blog_id } = req.params;

  const resultBlogs = await Blog.findOneAndDelete({ _id: blog_id });
  const resultDeletedtUserId = await resultBlogs.user_id;

  const remainingBlogs = await Blog.find({
    user_id: resultDeletedtUserId,
    published: true,
  });

  res.send({
    msg: `Deleting blog ${blog_id}`,
    result: remainingBlogs,
  });
});

module.exports = router;
