import { Router } from 'express';
import { v1AuthRoutes } from './auth';
import { v1PatientRoutes } from './patients';
import { v1DepartmentRoutes } from './department';
import { v1ServiceRoutes } from './service';
import { v1StaffRoutes } from './staff';
import { v1OrderRoutes } from './orders';

const router = Router();

router.use('/auth', v1AuthRoutes);
router.use('/patients', v1PatientRoutes);
router.use('/staffs', v1StaffRoutes);
router.use('/departments', v1DepartmentRoutes);
router.use('/services', v1ServiceRoutes);
router.use('/orders', v1OrderRoutes);

export { router as v1Routes };
