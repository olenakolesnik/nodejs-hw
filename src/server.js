import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});


app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
      "message": `Retrieved note with ID: ${noteId}`
  });
});
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd ? 'Server Error' : err.stack,
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
