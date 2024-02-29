import { Request, Response, Router } from 'express';
import { currentUser } from '../../common/middlewares/current-user';
import { requireAuth } from '../../common/middlewares/require-auth';
import {
  findMyPendingTask,
  findMyTodayCompletedTask,
} from '../../helpers/order';
import { Patient } from '../../models/v1/patient';
import { Staff } from '../../models/v1/staff';
import { Room } from '../../models/v1/room';
import { Service } from '../../models/v1/service';
import { Department } from '../../models/v1/department';
import { getTodayAppointments } from '../../helpers/appointment';
import { Admission } from '../../models/v1/admission';

const router = Router();
interface DashboardProperty {
  label: string;
  value: string | number;
}
router.get(
  '/',
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const myPendingTasks = await findMyPendingTask(req.user.id);
    const myTodayCompletedTasks = await findMyTodayCompletedTask(req.user.id);

    let dashboards: DashboardProperty[] = [];

    if (req.user.role !== 'Admin') {
      dashboards = dashboards.concat([
        { label: 'Pending tasks', value: myPendingTasks.length },
        { label: 'My tasks today', value: myTodayCompletedTasks.length },
      ]);
    }

    if (['Admin', 'Manager', 'Receptionist', 'Nurse'].includes(req.user.role)) {
      const totalPatients = (await Patient.find({})).length;
      const todayTotalAppointments = (await getTodayAppointments()).length;
      const totalAdmittedPatients = (
        await Admission.find({ status: 'Admitted' })
      ).length;

      dashboards = dashboards.concat([
        { label: 'Today appointments', value: todayTotalAppointments },
        { label: 'Admitted patients', value: totalAdmittedPatients },
        { label: 'Total patients', value: totalPatients },
      ]);
    }

    if (['Admin', 'Manager'].includes(req.user.role)) {
      const totalStaffs = (await Staff.find({})).length;
      const totalRooms = (await Room.find({})).length;
      const totalServices = (await Service.find({})).length;
      const totalDepartments = (await Department.find({})).length;

      dashboards = dashboards.concat([
        { label: 'Total staffs', value: totalStaffs },
        { label: 'Total rooms', value: totalRooms },
        { label: 'Total services', value: totalServices },
        { label: 'Total departments', value: totalDepartments },
      ]);
    }

    res.send(dashboards);
  }
);

export { router as v1DashboardRoutes };
