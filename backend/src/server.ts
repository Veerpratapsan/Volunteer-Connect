import app from './app';
import { config } from './config/unifiedConfig';

const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`[Server]: API is running on port ${PORT}`);
  console.log(`[Firebase]: Connected to project ${config.firebase.projectId}`);
});
