const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  imgURL: {
    type: String,
    required: true,
    unique: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },

  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
