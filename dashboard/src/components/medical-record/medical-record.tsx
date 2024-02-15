// MedicalRecordComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function MedicalRecordComponent({ medicalRecordId }) {
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicalRecord() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/medical-records/${medicalRecordId}`
        );
        setMedicalRecord(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medical record:', error);
      }
    }

    fetchMedicalRecord();
  }, [medicalRecordId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!medicalRecord) {
    return <p>Medical record not found</p>;
  }

  return (
    <div>
      <h2>Medical Record</h2>
      <p>
        <strong>Patient ID:</strong> {medicalRecord.patientId}
      </p>
      <p>
        <strong>Date:</strong>{' '}
        {new Date(medicalRecord.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Doctor ID:</strong> {medicalRecord.doctorId}
      </p>
      <p>
        <strong>Clinical Notes:</strong> {medicalRecord.clinicalNotes}
      </p>
      <p>
        <strong>Diagnosis:</strong> {medicalRecord.diagnosis}
      </p>
      <h3>Prescriptions</h3>
      <ul>
        {medicalRecord.prescriptions.map((prescription, index) => (
          <li key={index}>
            <p>
              <strong>Medication Name:</strong> {prescription.medicationName}
            </p>
            <p>
              <strong>Dosage:</strong> {prescription.dosage}
            </p>
            <p>
              <strong>Frequency:</strong> {prescription.frequency}
            </p>
          </li>
        ))}
      </ul>
      <h3>Lab Results</h3>
      <ul>
        {medicalRecord.labResults.map((labResult, index) => (
          <li key={index}>
            <p>
              <strong>Test Type:</strong> {labResult.testType}
            </p>
            <p>
              <strong>Result:</strong> {labResult.result}
            </p>
          </li>
        ))}
      </ul>
      <h3>Imaging Reports</h3>
      <ul>
        {medicalRecord.imagingReports.map((imagingReport, index) => (
          <li key={index}>
            <p>
              <strong>Imaging Type:</strong> {imagingReport.imagingType}
            </p>
            <p>
              <strong>Report:</strong> {imagingReport.report}
            </p>
            <img src={imagingReport.imageUrl} alt={`Imaging Report ${index}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicalRecordComponent;
