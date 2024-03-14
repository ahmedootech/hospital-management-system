// MedicalRecordComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { Button, Modal } from 'react-bootstrap';
import NursesAssessmentForm from './nurses-assessment-form';
import { apiV1, getApiV1Instance } from '../../utils/axios-instance';
import MedicalRecord from './medical-record';
import ClinicalNoteForm from './clincal-note-form';
import InvestigationForm from './investigation-form';
import { isAuthorized } from '../../utils';

function MedicalRecords() {
  const [showNursesAssessmentModal, setShowNursesAssessmentModal] =
    useState(false);
  const [showClinicalNotesModal, setShowClinicalNotesModal] = useState(false);
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);

  // Handler functions for showing/hiding each modal
  const handleCloseNursesAssessmentModal = () =>
    setShowNursesAssessmentModal(false);
  const handleShowNursesAssessmentModal = () =>
    setShowNursesAssessmentModal(true);

  const handleCloseClinicalNotesModal = () => setShowClinicalNotesModal(false);
  const handleShowClinicalNotesModal = () => setShowClinicalNotesModal(true);

  const handleCloseInvestigationModal = () => setShowInvestigationModal(false);
  const handleShowInvestigationModal = () => setShowInvestigationModal(true);

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMedicalRecord() {
      try {
        const res = await getApiV1Instance().get(`/medical-records/patient/records`);
        console.log(res);
        setMedicalRecords(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medical record:', error);
      }
    }

    fetchMedicalRecord();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {medicalRecords.length > 0 ? (
        medicalRecords.map((record, index) => {
          return <MedicalRecord record={record} key={index} />;
        })
      ) : (
        <p>No record found</p>
      )}
    </div>
  );
}

export default MedicalRecords;
