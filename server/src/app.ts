import express from 'express';
import cors from 'cors';

import yoga from './services/graphql-yoga';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://delicate-tarsier-8ee16b.netlify.app', 'http://localhost:3000'],
  credentials: true
}));

app.use('/graphql', yoga);

export default app;