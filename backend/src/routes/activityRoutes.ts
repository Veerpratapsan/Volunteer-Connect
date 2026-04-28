import { Router } from 'express';
import { ActivityController } from '../controllers/ActivityController';

const router = Router();
const activityController = new ActivityController();

router.post('/', (req, res) => activityController.createActivity(req, res));
router.get('/', (req, res) => activityController.getAllActivities(req, res));
router.get('/volunteer/:volunteerId', (req, res) => activityController.getActivitiesByVolunteer(req, res));
router.get('/ngo/:ngoId', (req, res) => activityController.getActivitiesByNgo(req, res));

export default router;
