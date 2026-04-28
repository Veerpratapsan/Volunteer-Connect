import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import issueRoutes from './routes/issueRoutes';
import requestRoutes from './routes/requestRoutes';
import activityRoutes from './routes/activityRoutes';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Volunteer Connect API running' });
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/activities', activityRoutes);

export default app;
