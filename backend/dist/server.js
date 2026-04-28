"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const unifiedConfig_1 = require("./config/unifiedConfig");
app_1.default.listen(unifiedConfig_1.config.port, () => {
    console.log(`[Server]: API is running on port ${unifiedConfig_1.config.port}`);
    console.log(`[Firebase]: Connected to project ${unifiedConfig_1.config.firebase.projectId}`);
});
