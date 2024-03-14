// MedicalRecordComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { Button, Modal } from 'react-bootstrap';
import NursesAssessmentForm from './nurses-assessment-form';
import { apiV1 } from '../../utils/axios-instance';
import MedicalRecord from './medical-record';
import ClinicalNoteForm from './clincal-note-form';
import InvestigationForm from './investigation-form';
import { isAuthorized } from '../../utils';

function MedicalRecords({ patientId }) {
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  async function fetchMedicalRecord() {
    try {
      const res = await apiV1.get(`/medical-records/${patientId}/records`);
      console.log(res);
      setMedicalRecords(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medical record:', error);
    }
  }
  useEffect(() => {
    fetchMedicalRecord();
  }, [patientId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {isClient ? (
        <div>
          <div className="d-flex">
            {isAuthorized(['Doctor', 'Nurse']) && (
              <button
                className="btn btn-secondary"
                onClick={handleShowNursesAssessmentModal}
              >
                <AddIcon /> Nursing Assessment
              </button>
            )}
            {isAuthorized(['Lab Technician']) && (
              <button
                className="btn btn-warning mx-2"
                onClick={handleShowInvestigationModal}
              >
                <AddIcon /> Investigation
              </button>
            )}
            {isAuthorized(['Doctor']) && (
              <button
                className="btn btn-primary mx-2"
                onClick={handleShowClinicalNotesModal}
              >
                <AddIcon /> Clinical Note
              </button>
            )}
          </div>

          {medicalRecords.length > 0 ? (
            medicalRecords.map((record, index) => {
              return <MedicalRecord record={record} key={index} />;
            })
          ) : (
            <p>No record found</p>
          )}

          <Modal
            show={showNursesAssessmentModal}
            onHide={handleCloseNursesAssessmentModal}
          >
            <Modal.Header closeButton>
              <Modal.Title>Nurses Assessment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
              <NursesAssessmentForm patientId={patientId} />
            </Modal.Body>
          </Modal>

          <Modal
            show={showClinicalNotesModal}
            onHide={handleCloseClinicalNotesModal}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Clinical Note</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
              <ClinicalNoteForm patientId={patientId} />
            </Modal.Body>
          </Modal>

          <Modal
            show={showInvestigationModal}
            onHide={handleCloseInvestigationModal}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Investigation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
              <InvestigationForm patientId={patientId} />
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  );
}

export default MedicalRecords;
