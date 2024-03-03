import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import { NotFoundError } from './common/errors/not-found-error';
import { errorHandler } from './common/middlewares/error-handler';

import { v1Routes } from './routes/v1';
import mongoose from 'mongoose';
import { Staff } from './models/v1/staff';
import { Department } from './models/v1/department';

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(json());

// app.get('/', (req, res) => {
//   res.send('Hello Hospital');
// });
app.use(express.static('public'));
app.use('/api/v1', v1Routes);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

const start = async () => {
  try {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
    if (!process.env.MONGODB_URI)
      throw new Error('MONGODB_URI must be defined');

    await mongoose.connect(process.env.MONGODB_URI);

    let adminDepartment = await Department.findOne({ name: 'Admin' });

    if (!adminDepartment) {
      const newAdminDepartment = Department.build({
        name: 'Admin',
        type: 'Default',
      });
      await newAdminDepartment.save();

      adminDepartment = newAdminDepartment.toJSON();
    }

    let physicianDepartment = await Department.findOne({
      name: 'Physician',
    });

    if (!physicianDepartment) {
      const newPhysicianDepartment = Department.build({
        name: 'Physician',
        type: 'Default',
      });
      await newPhysicianDepartment.save();

      physicianDepartment = newPhysicianDepartment.toJSON();
    }

    let nursingDepartment = await Department.findOne({
      name: 'Nursing',
    });

    if (!nursingDepartment) {
      const newNursingDepartment = Department.build({
        name: 'Nursing',
        type: 'Default',
      });
      await newNursingDepartment.save();

      nursingDepartment = newNursingDepartment.toJSON();
    }

    let laboratoryDepartment = await Department.findOne({
      name: 'Laboratory',
    });

    if (!laboratoryDepartment) {
      const newLaboratoryDepartment = Department.build({
        name: 'Laboratory',
        type: 'Default',
      });
      await newLaboratoryDepartment.save();

      laboratoryDepartment = newLaboratoryDepartment.toJSON();
    }

    let radiographyDepartment = await Department.findOne({
      name: 'Radiography',
    });

    if (!radiographyDepartment) {
      const newRadiographyDepartment = Department.build({
        name: 'Radiography',
        type: 'Default',
      });
      await newRadiographyDepartment.save();

      radiographyDepartment = newRadiographyDepartment.toJSON();
    }

    const existingAdmin = await Staff.findOne({
      role: 'Admin',
      type: 'Default',
    });

    if (!existingAdmin) {
      const defaultAdmin = Staff.build({
        firstName: 'Admin',
        lastName: 'Default',
        username: 'admin',
        password: '12345',
        gender: 'Neutral',
        address: 'Hospital address',
        dob: new Date(),
        marital: 'Neutral',
        phone: '080300000',
        type: 'Default',
        role: 'Admin',
        department: adminDepartment.id,
      });
      await defaultAdmin.save();
    }
    app.listen(8080, () => {
      console.log('Listening on port 8080');
    });
  } catch (err) {
    console.log(err);
  }
};

start();
