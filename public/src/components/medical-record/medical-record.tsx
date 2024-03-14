import RemoveIcon from '@mui/icons-material/Remove';
import Image from 'next/image';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { imagePreview, isAuthorized, prepareImageUrl } from '../../utils';
const MedicalRecord = ({ record }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imagePath, setImagePath] = useState(null);

  const handleCloseImageModal = () => setShowImageModal(false);
  const handleShowImageModal = () => setShowImageModal(true);
  return (
    <div className="container-fluid bg-light p-3 my-2">
      <h6>
        {new Date(record.dateOfVisit).toDateString()}{' '}
        {new Date(record.dateOfVisit).toLocaleTimeString()}
      </h6>
      {isAuthorized(['Nurse', 'Doctor']) && record.vitalSigns.length > 0 && (
        <div>
          <h5>Vital Signs</h5>
          <div className="px-3">
            {record.vitalSigns.map((vitalSign, index) => (
              <div key={index}>
                <h6>
                  <RemoveIcon />
                  By:{' '}
                  {`${vitalSign.servedBy.firstName} ${vitalSign.servedBy.lastName}`}{' '}
                  at: {new Date(vitalSign.createdAt).toLocaleString()}{' '}
                </h6>
                <ul>
                  {vitalSign.signs.map((sign, index) => (
                    <li key={index}>
                      {sign.name}: {sign.value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {isAuthorized(['Nurse', 'Doctor']) && record.clinicalNotes.length > 0 && (
        <div>
          <h5>Clinical Notes</h5>
          <div className="px-3">
            {record.clinicalNotes.map((clinicalNote, index) => (
              <div key={index} className="bg-white p-2 my-2">
                <h6 className="fw-bold">
                  By:{' '}
                  {`${clinicalNote.servedBy.firstName} ${clinicalNote.servedBy.lastName}`}{' '}
                  at: {new Date(clinicalNote.createdAt).toLocaleString()}{' '}
                </h6>
                <p className="px-3">
                  <span className="fw-bold">Clinical Note: </span>
                  <pre className="ps-3">{clinicalNote.note}</pre>
                </p>
                <p className="px-3">
                  <span className="fw-bold">Diagnosis: </span>
                  <pre className="ps-3">{clinicalNote.diagnosis}</pre>
                </p>
                {clinicalNote.prescriptions.length > 0 && (
                  <div className="px-3">
                    <h6 className="fw-bold mb-0">Prescriptions</h6>
                    <table className="table ms-2">
                      <thead>
                        <tr>
                          <th>Medication</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clinicalNote.prescriptions?.map(
                          (prescription, index) => (
                            <tr key={index}>
                              <td>{prescription.medicationName}</td>
                              <td>{prescription.dosage}</td>
                              <td>{prescription.frequency}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {record.investigations.length > 0 && (
        <div>
          <h5>Investigations</h5>
          <div className="px-3">
            {record.investigations.map((investigation, index) => (
              <div key={index} className="bg-white p-2 my-2">
                <h6 className="fw-bold">
                  By:{' '}
                  {`${investigation.servedBy.firstName} ${investigation.servedBy.lastName}`}{' '}
                  at: {new Date(investigation.createdAt).toLocaleString()}{' '}
                </h6>
                <p className="px-3 py-0 my-0">
                  <span className="fw-bold">
                    {investigation.investigation.name}:{' '}
                  </span>
                  {investigation.result}
                </p>
                {investigation.remark && (
                  <p className="px-3">
                    <span className="fw-bold">Remark: </span>
                    <pre className="ps-3">{investigation.remark}</pre>
                  </p>
                )}
                {investigation.imageURL && (
                  <button
                    className="ms-3 btn btn-secondary"
                    onClick={() => {
                      setImagePath(investigation.imageURL);
                      handleShowImageModal();
                    }}
                  >
                    View Investigation Image
                  </button>
                  // <p className="px-3">
                  //   <span className="fw-bold">Remark: </span>
                  //   <pre className="ps-3">{investigation.remark}</pre>
                  // </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal show={showImageModal} onHide={handleCloseImageModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Investigation Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Image
            className=""
            src={prepareImageUrl(imagePath)}
            alt={`Image Preview`}
            width={200}
            height={300}
            style={{ objectFit: 'cover', width: '100%' }}
          />
          {/* <NursesAssessmentForm patientId={patientId} /> */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MedicalRecord;
