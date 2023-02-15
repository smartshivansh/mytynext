const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThemeSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    body_appearance: {
      type: Schema.Types.Mixed,
    },
  },
  { minimize: false }
);

module.exports = Theme = mongoose.model("temp_theme", ThemeSchema);
