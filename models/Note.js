const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  message: String
});

const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
