import Log from './models/log.model.js';

export const saveLogToMongo = async (info) => {
  try {
    await Log.create(info);
  } catch (err) {
    console.error('Erro ao salvar log no MongoDB:', err);
  }
};