"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.auth = exports.db = void 0;
require("dotenv/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const admin = __importStar(require("firebase-admin"));
function tryLoadServiceAccount() {
    const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const defaultPath = path.join(process.cwd(), 'serviceAccountKey.json');
    const jsonPath = explicitPath && fs.existsSync(explicitPath) ? explicitPath : defaultPath;
    if (!fs.existsSync(jsonPath)) {
        return null;
    }
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw);
}
if (!admin.apps.length) {
    const serviceAccount = tryLoadServiceAccount();
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    else {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    }
}
exports.db = admin.firestore();
exports.auth = admin.auth();
exports.config = {
    port: Number(process.env.PORT) || 3001,
    firebase: {
        projectId: admin.app().options.projectId || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'unknown',
    },
};
