import express from 'express';
import cors from 'cors';
import auth from './routes/auth';
import tasks from './routes/tasks';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/tasks', tasks);

app.listen(5000, () => console.log('Server running'));
