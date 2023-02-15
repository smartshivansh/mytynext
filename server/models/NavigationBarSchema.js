const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NavigationBarSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    brand: {
      type: Schema.Types.Mixed,
    },
    menu_items: {
      type: Schema.Types.Array,
    },
    styles: {
      type: Schema.Types.Mixed,
    },
  },
  { minimize: false }
);

module.exports = NavigationBar = mongoose.model(
  "temp_navigationbar",
  NavigationBarSchema
);
