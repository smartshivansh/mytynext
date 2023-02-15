const Blog = require('../../models/BlogSchema');
const Feeds = require('../../models/feeds');
const Images = require('../../models/ImagePostSchema');
const Video = require('../../models/VideoPostSchema');
const mongoose = require('mongoose');

const BLOG = async (slug, action) => {
  console.log('inside BLOG');
  try {
    const data = await Blog.aggregate([
      {
        $match: {
          slug: slug,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id',
        },
      },
      {
        $unwind: {
          path: '$user_id',
          includeArrayIndex: 'string',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          'user_id.tutor': 0,
          'user_id.qrcode': 0,
          'user_id.email': 0,
          'user_id.password': 0,
          // "user_id.username": 0,
          'user_id.userlink': 0,
          'user_id.register_date': 0,
          'user_id.seo': 0,
          'user_id.location': 0,
          'user_id.place': 0,
          'user_id.plan': 0,
          'user_id.setupLink': 0,
          'user_id.official': 0,
          'user_id.admin': 0,
          'user_id.domain': 0,
          'user_id.searchable': 0,
          content_raw: 0,
        },
      },
    ]);

    const result = await Feeds.findOneAndUpdate(
      { _id: '6209f701bfd26938f3161f28' },
      action ? { $pull: { feeds: data[0] } } : { $push: { feeds: data } },
      { upsert: true, new: true }
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};

const IMAGE = async (id, action) => {
  console.log('inside IMAGE', id);
  try {
    const data = await Images.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'temp_mediaimages',
          localField: 'images',
          foreignField: '_id',
          as: 'images',
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id',
        },
      },
      {
        $unwind: {
          path: '$user_id',
          includeArrayIndex: 'string',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          images: 1,
          published: 1,
          type: 1,
          'user_id.subdomain': 1,
          'user_id._id': 1,
          'user_id.name': 1,
          'user_id.username': 1,
          'user_id.image_url': 1,
          caption: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    const result = await Feeds.findOneAndUpdate(
      { _id: '6209f701bfd26938f3161f28' },
      action ? { $pull: { feeds: data[0] } } : { $push: { feeds: data } },
      { upsert: true, new: true }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

const VIDEO = async (id, action) => {
  console.log('inside VIDEO id ', id);
  try {
    const data = await Video.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'temp_mediavideos',
          localField: 'videos',
          foreignField: '_id',
          as: 'videos',
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id',
        },
      },
      {
        $unwind: {
          path: '$user_id',
          includeArrayIndex: 'string',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          'user_id.tutor': 0,
          'user_id.qrcode': 0,
          'user_id.email': 0,
          'user_id.password': 0,
          // "user_id.username": 0,
          'user_id.userlink': 0,
          'user_id.register_date': 0,
          'user_id.seo': 0,
          'user_id.location': 0,
          'user_id.place': 0,
          'user_id.plan': 0,
          'user_id.setupLink': 0,
          'user_id.official': 0,
          'user_id.admin': 0,
          'user_id.domain': 0,
          'user_id.searchable': 0,
          'user_id.updateAt': 0,
        },
      },
    ]);

    const result = await Feeds.findOneAndUpdate(
      { _id: '6209f701bfd26938f3161f28' },
      action ? { $pull: { feeds: data[0] } } : { $push: { feeds: data } },
      { upsert: true, new: true }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  BLOG,
  IMAGE,
  VIDEO,
};
