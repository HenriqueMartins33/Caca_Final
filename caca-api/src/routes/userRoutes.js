import { Router } from 'express';
import { deleteUser, getProfile, getUsers, updateProfile } from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.get('/', requireAuth, requireRole('admin'), getUsers);
router.delete('/:id', requireAuth, requireRole('admin'), deleteUser);

export default router;
