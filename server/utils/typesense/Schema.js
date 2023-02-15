const blogSchema = () => {
  console.log("inside blogSchema");
  return {
    name: "blogs",
    fields: [
      { name: "_id", type: "string", facet: false },
      { name: "title", type: "string", facet: false },
      { name: "username", type: "string", facet: false },
      { name: "user_fullname", type: "string", facet: false },
      { name: "published", type: "bool", facet: false },
      // ! This way nested fields are not indexed
      /**
       * !RequestMalformed [Error]: Request failed with HTTP code 400 | Server said: Field `user_id.subdomain` has been declared in the schema, but is not found in the document.
       * !    at ApiCall.customErrorForResponse (/var/www/html/myty/node_modules/typesense/lib/Typesense/ApiCall.js:217:21)
       * !    at ApiCall.performRequest (/var/www/html/myty/node_modules/typesense/lib/Typesense/ApiCall.js:115:48)
       * !    at runMicrotasks (<anonymous>)
       * !    at processTicksAndRejections (internal/process/task_queues.js:95:5)
       * !    at async Documents.create (/var/www/html/myty/node_modules/typesense/lib/Typesense/Documents.js:12:16)
       * !    at async /var/www/html/myty/utils/typesense/actions.js:186:33 {
       * !  httpStatus: 400
       * !}
       */
      // { name: "user_id.name", type: "string", facet: false },
      // { name: "user_id.username", type: "string", facet: false },
      // { name: "user_id.subdomain", type: "string", facet: false },
      {
        name: "subtitle",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "category",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "tags",
        type: "string[]",
        facet: true,
      },
      {
        name: "slug",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "featured_image",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "drafted",
        type: "bool",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "published",
        type: "bool",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "feeds",
        type: "bool",
        optional: true,
        index: false,
        facet: false,
      },
      {
        name: "type",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "content_raw",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "updatedAt",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "__v",
        type: "int32",
        index: false,
        facet: false,
        optional: true,
      },
    ],
  };
};

const imageSchema = () => {
  return {
    name: "image",
    fields: [
      { name: "caption", type: "string", facet: false },
      { name: "username", type: "string", facet: false },
      { name: "published", type: "bool", facet: false },
      {
        name: "type",
        type: "string",
        facet: false,
        index: false,
        optional: true,
      },
      {
        name: "published",
        type: "bool",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "updatedAt",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "__v",
        type: "int32",
        index: false,
        facet: false,
        optional: true,
      },
    ],
  };
};

const videoSchema = () => {
  return {
    name: "video",
    fields: [
      { name: "caption", type: "string", facet: false },
      { name: "username", type: "string", facet: false },
      { name: "published", type: "bool", facet: false },
      {
        name: "type",
        type: "string",
        facet: false,
        index: false,
        optional: true,
      },
      {
        name: "published",
        type: "bool",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "updatedAt",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "__v",
        type: "int32",
        index: false,
        facet: false,
        optional: true,
      },
    ],
  };
};

const quoteSchema = () => {
  return {
    name: "quote",
    fields: [
      { name: "quote", type: "string", facet: false },
      { name: "username", type: "string", facet: false },
      { name: "quoted_by", type: "string", facet: false },
      {
        name: "published",
        type: "bool",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "type",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "updatedAt",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "__v",
        type: "int32",
        index: false,
        facet: false,
        optional: true,
      },
    ],
  };
};

const linkSchema = () => {
  return {
    name: "link",
    fields: [
      { name: "title", type: "string", facet: false },
      { name: "username", type: "string", facet: false },
      { name: "user_fullname", type: "string", facet: false },
      { name: "published", type: "bool", facet: false },
      {
        name: "published",
        type: "bool",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "type",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "updatedAt",
        type: "string",
        index: false,
        facet: false,
        optional: true,
      },
      {
        name: "__v",
        type: "int32",
        index: false,
        facet: false,
        optional: true,
      },
    ],
  };
};

module.exports = {
  blogSchema,
  imageSchema,
  videoSchema,
  quoteSchema,
  linkSchema,
};
