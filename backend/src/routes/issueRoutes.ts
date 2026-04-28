import { Router } from 'express';
import { IssueController } from '../controllers/IssueController';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const issueController = new IssueController();

router.post('/', requireAuth, asyncErrorWrapper((req, res) => issueController.createIssue(req, res)));
router.get('/', (req, res) => issueController.getAllIssues(req, res));
router.get('/:id', (req, res) => issueController.getIssueById(req, res));
router.put('/:id', (req, res) => issueController.updateIssue(req, res));
router.delete('/:id', (req, res) => issueController.deleteIssue(req, res));

export default router;
