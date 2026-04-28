"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const BaseController_1 = require("./BaseController");
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    role: zod_1.z.enum(['ngo', 'volunteer']),
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().optional(),
    uniqueId: zod_1.z.string().optional(),
});
class UserController extends BaseController_1.BaseController {
    userService;
    constructor(userService) {
        super();
        this.userService = userService;
    }
    async createProfile(req, res) {
        try {
            if (!req.user)
                throw new Error('Unauthorized');
            const validatedData = createUserSchema.parse(req.body);
            const user = await this.userService.createUserProfile(req.user.uid, req.user.email || '', validatedData.role, validatedData);
            this.handleSuccess(res, user, 201);
        }
        catch (error) {
            this.handleError(error, res, 'createUserProfile');
        }
    }
    async getMyProfile(req, res) {
        try {
            if (!req.user)
                throw new Error('Unauthorized');
            const user = await this.userService.getProfile(req.user.uid);
            this.handleSuccess(res, user);
        }
        catch (error) {
            this.handleError(error, res, 'getMyProfile');
        }
    }
}
exports.UserController = UserController;
