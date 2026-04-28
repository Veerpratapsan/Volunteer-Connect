import { Router } from 'express';
import { RequestController } from '../controllers/RequestController';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const requestController = new RequestController();

router.post('/', requireAuth, asyncErrorWrapper((req, res) => requestController.createRequest(req, res)));
router.get('/', asyncErrorWrapper((req, res) => requestController.getAllRequests(req, res)));
router.get('/:id', asyncErrorWrapper((req, res) => requestController.getRequestById(req, res)));
router.put('/:id', requireAuth, asyncErrorWrapper((req, res) => requestController.updateRequest(req, res)));
router.delete('/:id', asyncErrorWrapper((req, res) => requestController.deleteRequest(req, res)));

export default router;
