import { Router } from 'express';
import { v1AuthRoutes } from './auth';
import { v1PatientRoutes } from './patients';
import { v1DepartmentRoutes } from './department';
import { v1ServiceRoutes } from './service';
import { v1StaffRoutes } from './staff';
import { v1OrderRoutes } from './orders';
import { v1RoomRoutes } from './rooms';
import { v1AdmissionRoutes } from './admissions';
import { v1AppointmentRoutes } from './appointments';
import { v1TaskRoutes } from './tasks';
import { v1MedicalRecordRoutes } from './medical-records';
import { v1DashboardRoutes } from './dashboard';

const router = Router();

router.use('/auth', v1AuthRoutes);
router.use('/patients', v1PatientRoutes);
router.use('/staffs', v1StaffRoutes);
router.use('/departments', v1DepartmentRoutes);
router.use('/services', v1ServiceRoutes);
router.use('/orders', v1OrderRoutes);
router.use('/rooms', v1RoomRoutes);
router.use('/admissions', v1AdmissionRoutes);
router.use('/appointments', v1AppointmentRoutes);
router.use('/tasks', v1TaskRoutes);
router.use('/medical-records', v1MedicalRecordRoutes);
router.use('/dashboards', v1DashboardRoutes);

export { router as v1Routes };
