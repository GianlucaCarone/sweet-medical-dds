import winston from 'winston';

// Definimos el formato personalizado
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // winston.format.colorize(), // Podés descomentar esto para ver colores en la consola
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Nivel mínimo a registrar
  format: logFormat,
  transports: [
    // 1. Siempre mostramos en consola
    new winston.transports.Console(),
    
    // 2. Opcional: Guardamos los errores graves en un archivo
    //new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    
    // 3. Opcional: Guardamos TODOS los logs en otro archivo
    //new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});