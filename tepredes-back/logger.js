import { createLogger, format, transports } from 'winston';
import { saveLogToMongo } from './loggMongo.js';

const customFormat = format.printf(info => {
  saveLogToMongo({
    ...info,
    level: info.level || 'info'
  });
  return JSON.stringify({
    message: info.message,
    nome: info.nome,
    email: info.email,
    hostname: info.hostname,
    ip: info.ip,
    method: info.method,
    url: info.url,
    timestamp: info.timestamp
  });
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: () => new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) }),
    customFormat
  ),
  transports: [
    new transports.Console({ level: 'info' }),
  ]
});

export default logger;