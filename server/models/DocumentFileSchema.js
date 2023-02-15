const mongoose = require("mongoose");
const { Schema } = mongoose;

const pdfDocumentSchema = new Schema({}, { timestamps: true });

const pdfDocument = mongoose.model("temp_pdfs", pdfDocumentSchema);
module.exports = pdfDocument;
