import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  addMember,
  createProject,
  getProject,
  listProjects,
  updateProjectManager,
} from '../controllers/project.controller';

const router = Router();

router.use(authenticate);

router.post('/', authorize('pm'), createProject);
router.get('/', listProjects);
router.get('/:id', getProject);
router.patch('/:id/manager', authorize('admin'), updateProjectManager);
router.post('/:id/members', authorize('admin', 'pm'), addMember);

export default router;
