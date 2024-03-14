import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form-controls/input';
import SubmitButton from '../form-controls/submit-button';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { apiV1 } from '../../utils/axios-instance';
import { toast } from 'react-toastify';
import { handleYupErrors } from '../../utils/yup-form-helpers';
import TextArea from '../form-controls/textarea';
import { imagePreview } from '../../utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Select from '../form-controls/select';

const defaultValues = {
  investigation: '',
  result: '',
  remark: '',
  image: '',
};

const FILE_SIZE = 1024 * 1024 * 2;
const InvestigationForm = ({ patientId }) => {
  const [investigations, setInvestigations] = useState([]);

  useEffect(() => {
    const getInvestigations = async () => {
      try {
        const res = await apiV1.get('/services/investigations');
        setInvestigations(res.data);
      } catch (err) {
        console.log(err);
        toast.error('Error in getting investigations');
        setInvestigations([]);
      }
    };
    getInvestigations();
  }, []);

  const investigationSchema = yup.object().shape({
    investigation: yup.string().required('investigation is required'),
    result: yup.string().required('result is required'),
    remark: yup.string(),
    image: yup
      .mixed()
      .test('isImage', 'Please upload an image', (value: any) => {
        // if (!value) return false;
        if (!value) return true;
        const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!value.length) return false; // No file is selected, consider it invalid.
        for (const image of value) {
          if (!ALLOWED_FORMATS.includes(image.type)) return false;
        }
        return true;
      })
      .test('fileSize', 'Please ensure each image is < 2MB', (value: any) => {
        if (!value.length) return true;
        for (const image of value) {
          if (image.size > FILE_SIZE) return false;
        }
        return true;
      }),
  });

  const methods = useForm<FieldValues>({
    defaultValues,
    resolver: yupResolver(investigationSchema),
  });

  const saveInvestigationHandler = async (data) => {
    // console.log(data);
    // return;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') formData.append(key, value[0]);
      else if (key === 'imagePreview') null;
      else formData.append(key, `${value}`);
    });
    try {
      const res = await apiV1.put(
        `/medical-records/${patientId}/investigations`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      methods.reset(defaultValues);
      toast.success('Patient investigation added successfully');
    } catch (err) {
      console.log(err);
      const errors = err.response.data.errors;
      if (errors[0].field) {
        handleYupErrors({
          formFields: data,
          serverError: errors,
          yupSetError: methods.setError,
        });
      } else {
        toast.error(errors[0].message);
      }
    }
  };
  return (
    <form onSubmit={methods.handleSubmit(saveInvestigationHandler)}>
      <section>
        {/* <h5>Clinical Note</h5> */}
        <div className="container-fluid">
          <Select
            control={methods.control}
            name="investigation"
            label="Investigations"
          >
            <option value="">---Choose investigation---</option>
            {investigations.map((investigation, index) => (
              <option key={index} value={investigation.id}>
                {investigation.name}
              </option>
            ))}
          </Select>
          <Input
            type="text"
            control={methods.control}
            label="Result"
            name="result"
          />
          <TextArea control={methods.control} label="Remark" name="remark" />
          <div className="w-100">
            {
              methods.watch(`imagePreview`) ? (
                <Image
                  className=""
                  src={methods.watch(`imagePreview`)}
                  alt={`Image Preview`}
                  width={200}
                  height={300}
                  style={{ objectFit: 'cover', width: '100%' }}
                />
              ) : null
              //   <div
              //     className="border"
              //     style={{ height: '200px', width: '100%' }}
              //   ></div>
            }
            <label htmlFor="images" className="d-block fw-bold mb-2">
              Image:
            </label>
            <div className="d-flex flex-column my-2">
              <input
                type="file"
                name="image"
                {...methods.register('image')}
                className="form-control flex-grow-1"
                onChange={async (e) => {
                  const file = e.target.files[0];

                  // Get and set image preview
                  const preview = await imagePreview(file);
                  methods.setValue('imagePreview', preview);
                }}
              />
              {methods.formState.errors['image'] ? (
                <p className="form-text text-danger p-0 m-0">
                  {`${methods.formState.errors['image']?.message}`}
                </p>
              ) : null}
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <SubmitButton label="Save Investigation" />
          </div>
        </div>
      </section>
    </form>
  );
};

export default InvestigationForm;
