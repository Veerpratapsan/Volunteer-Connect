import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

function tryLoadServiceAccount(): admin.ServiceAccount | null {
  const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const defaultPath = path.join(process.cwd(), 'serviceAccountKey.json');
  const jsonPath = explicitPath && fs.existsSync(explicitPath) ? explicitPath : defaultPath;
  if (!fs.existsSync(jsonPath)) {
    return null;
  }
  const raw = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(raw) as admin.ServiceAccount;
}

if (!admin.apps.length) {
  const serviceAccount = tryLoadServiceAccount();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export const config = {
  port: Number(process.env.PORT) || 3001,
  firebase: {
    projectId: admin.app().options.projectId || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'unknown',
  },
};
