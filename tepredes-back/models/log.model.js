import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  message: String,
  nome: String,
  email: String,
  hostname: String,
  ip: String,
  method: String,
  url: String,
  timestamp: String,
  level: String
});

export default mongoose.model('Log', logSchema);