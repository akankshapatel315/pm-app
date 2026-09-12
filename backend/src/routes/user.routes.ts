import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { listUsers } from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'pm'), listUsers);

export default router;
