import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createEntry, listMyEntries } from '../controllers/entry.controller';

const router = Router();

router.use(authenticate);

router.post('/', createEntry);
router.get('/me', listMyEntries);

export default router;
