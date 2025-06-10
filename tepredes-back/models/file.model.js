import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  uploadedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

export default File;