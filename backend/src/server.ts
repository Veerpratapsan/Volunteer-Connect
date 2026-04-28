import app from './app';
import { config } from './config/unifiedConfig';

app.listen(config.port, () => {
  console.log(`[Server]: API is running on port ${config.port}`);
  console.log(`[Firebase]: Connected to project ${config.firebase.projectId}`);
});
