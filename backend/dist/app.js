"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const issueRoutes_1 = __importDefault(require("./routes/issueRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Volunteer Connect API running' });
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/issues', issueRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
exports.default = app;
