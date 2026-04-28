"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/userRoutes.ts
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const UserService_1 = require("../services/UserService");
const UserRepository_1 = require("../repositories/UserRepository");
const authMiddleware_1 = require("../middleware/authMiddleware");
const asyncErrorWrapper_1 = require("../utils/asyncErrorWrapper");
const router = (0, express_1.Router)();
// Dependency Injection manually setup for now
const userRepository = new UserRepository_1.UserRepository();
const userService = new UserService_1.UserService(userRepository);
const userController = new UserController_1.UserController(userService);
router.post('/profile', authMiddleware_1.requireAuth, (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => userController.createProfile(req, res)));
router.get('/profile/me', authMiddleware_1.requireAuth, (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => userController.getMyProfile(req, res)));
exports.default = router;
