/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, Field, FieldArray } from "formik";
import {
  PrimaryButton,
  TextField,
  Dropdown,
  DatePicker,
  IDropdownOption,
  Stack,
  Label,
} from "@fluentui/react";
import * as Yup from "yup";
import React, { useState } from "react";
import axios from "axios";
const classOptions: IDropdownOption[] = [
  { key: "0", text: "10" },
  { key: "1", text: "12" },
  { key: "2", text: "B.Tech" },
  { key: "3", text: "BCA" },
];
interface AddResumePanelProps {
  initialValues?: {
    id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    address?: {
      house?: string;
      street?: string;
      landmark?: string;
      district?: string;
      city?: string;
      pincode?: number;
      state?: string;
    };
    phone?: string;
    email?: string;
    designation?: string;
    description?: string;
    about?: string;
    education?: Array<{
      school: string;
      class: string;
      cgpa: string;
      yearOfPassing: string;
    }>;
    experience?: Array<{
      designation: string;
      startDate: string;
      endDate: string;
      skills: string[];
    }>;
    image?: File | null;
    signature?: File | null;
  };
  onClose: () => void;
}
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.object().shape({
    house: Yup.string()
      .typeError("House must be a string")
      .required("House is required"),
    street: Yup.string()
      .typeError("Street must be a string")
      .required("Street is required"),
    landmark: Yup.string()
      .typeError("Landmark must be a string")
      .required("Landmark is required"),
    district: Yup.string()
      .typeError("District must be a string")
      .required("District is required"),
    city: Yup.string()
      .typeError("City must be a string")
      .required("City is required"),
    pincode: Yup.number()
      .typeError("Pincode must be a number")
      .required("Pincode is required")
      .positive("Pincode must be greater than 0"),
    state: Yup.string()
      .typeError("State must be a string")
      .required("State is required"),
  }),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
    .required("Phone is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  designation: Yup.string().required("Designation is required"),
  description: Yup.string().required("Description is required"),
  about: Yup.string().max(150).required("About is required"),
  education: Yup.array().of(
    Yup.object().shape({
      school: Yup.string().required("School is required"),
      class: Yup.string().required("Class is required"),
      cgpa: Yup.number()
        .typeError("CGPA must be a number")
        .required("CGPA is required"),
      yearOfPassing: Yup.number()
        .typeError("Year of Passing must be a number")
        .required("Year of Passing is required"),
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      designation: Yup.string().required("Designation is required"),
      startDate: Yup.date().required("Start Date is required"),
      endDate: Yup.date().required("End Date is required"),
      skills: Yup.array().of(Yup.string().required("Skill is required")),
    })
  ),
});
const AddResumePanel: React.FC<AddResumePanelProps> = ({
  initialValues = {},
  onClose,
}) => {
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const token = localStorage.getItem("token");
  const [signatureImagePreview, setSignatureImagePreview] = useState<
    string | null
  >(null);
  const handleImagePreview = (
    file: File,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const formikInitialValues = {
    id: initialValues.id || null,
    firstName: initialValues.firstName || "",
    middleName: initialValues.middleName || "",
    lastName: initialValues.lastName || "",
    address: initialValues.address || {
      house: "",
      street: "",
      landmark: "",
      district: "",
      city: "",
      pincode: 0,
      state: "",
    },
    phone: initialValues.phone || "",
    email: initialValues.email || "",
    designation: initialValues.designation || "",
    description: initialValues.description || "",
    about: initialValues.about || "",
    education: initialValues.education || [
      { school: "", class: "", cgpa: "", yearOfPassing: "" },
    ],
    experience: initialValues.experience || [
      { designation: "", startDate: "", endDate: "", skills: [""] },
    ],
    image: null,
    signature: null,
  };
  const handleImageDelete = (
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setFieldValue: Function,
    fieldName: string
  ) => {
    setPreview(null);
    setFieldValue(fieldName, null);
  };
  return (
    <Formik
      initialValues={formikInitialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const formData = new FormData();
        // Append all non-file fields
        formData.append(
          "name",
          `${values.firstName} ${values.middleName} ${values.lastName}`
        );
        formData.append("phone", values.phone);
        formData.append("email", values.email);
        formData.append("designation", values.designation);
        formData.append("description", values.description);
        formData.append("about", values.about);
        // Address fields
        (
          Object.keys(values.address) as Array<keyof typeof values.address>
        ).forEach((key) => {
          formData.append(`address.${key}`, values.address[key]);
        });
        // Education fields
        values.education.forEach((edu, index) => {
          formData.append(`education[${index}].school`, edu.school);
          formData.append(`education[${index}].class`, edu.class.toString());
          formData.append(`education[${index}].cgpa`, edu.cgpa.toString());
          formData.append(
            `education[${index}].yearOfPassing`,
            edu.yearOfPassing.toString()
          );
        });
        // Experience fields
        values.experience.forEach((exp, index) => {
          formData.append(`experience[${index}].designation`, exp.designation);
          formData.append(`experience[${index}].startDate`, exp.startDate);
          formData.append(`experience[${index}].endDate`, exp.endDate);
          exp.skills.forEach((skill, skillIndex) => {
            formData.append(
              `experience[${index}].skills[${skillIndex}]`,
              skill
            );
          });
        });
        // Append files if they exist
        if (values.image) formData.append("image", values.image);
        if (values.signature) formData.append("signature", values.signature);
        if (values.id) {
          await axios.post(
            `http://localhost:5232/api/User/update/${values.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("Profile updated successfully!");
        } else {
          await axios.post(`http://localhost:5232/api/User`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert("Profile added successfully!");
        }

        onClose();
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Field
              name="firstName"
              as={TextField}
              label="First Name"
              required
            />
            <Field name="middleName" as={TextField} label="Middle Name" />
            <Field name="lastName" as={TextField} label="Last Name" required />
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Field name="address.house" as={TextField} label="House" required />
            <Field
              name="address.street"
              as={TextField}
              label="Street"
              required
            />
            <Field
              name="address.landmark"
              as={TextField}
              label="Landmark"
              required
            />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Field
              name="address.district"
              as={TextField}
              label="District"
              required
            />
            <Field name="address.city" as={TextField} label="City" required />
            <Field
              name="address.pincode"
              as={TextField}
              label="Pincode"
              type="number"
              required
            />
            <Field name="address.state" as={TextField} label="State" required />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 30 }}>
            <Field
              style={{ width: "250px" }}
              name="phone"
              as={TextField}
              label="Phone"
              required
            />
            <Field
              style={{ width: "250px" }}
              name="email"
              as={TextField}
              label="Email"
              required
            />
          </Stack>
          <Field
            name="designation"
            as={TextField}
            label="Designation"
            required
          />
          <Field
            name="description"
            as={TextField}
            label="Description"
            required
          />
          <Field
            name="about"
            as={TextField}
            label="About"
            multiline
            rows={5}
            required
          />
          <FieldArray name="education">
            {({ remove, push }) => (
              <div
                style={{
                  border: "1px solid grey",
                  marginTop: "10px",
                  padding: "10px",
                }}
              >
                <Label style={{ fontSize: "25px" }}>Education</Label>
                <PrimaryButton
                  style={{ marginTop: "10px" }}
                  text="Add Education"
                  onClick={() =>
                    push({ school: "", class: "", cgpa: "", yearOfPassing: "" })
                  }
                />
                {(values.education || []).map((_, index: number) => (
                  <Stack key={index} tokens={{ childrenGap: 20 }}>
                    <Field
                      name={`education[${index}].school`}
                      as={TextField}
                      label="School"
                      required
                    />
                    <Dropdown
                      placeholder="Select Class"
                      label="Class"
                      options={classOptions}
                      onChange={(_, option) =>
                        setFieldValue(`education[${index}].class`, option?.key)
                      }
                      required
                    />
                    <Field
                      name={`education[${index}].cgpa`}
                      as={TextField}
                      label="CGPA"
                      type="number"
                      required
                    />
                    <Field
                      name={`education[${index}].yearOfPassing`}
                      as={TextField}
                      label="Year of Passing"
                      type="number"
                      required
                    />
                    <PrimaryButton
                      style={{ width: "50px" }}
                      text="Remove"
                      onClick={() => remove(index)}
                    />
                  </Stack>
                ))}
              </div>
            )}
          </FieldArray>
          <FieldArray name="experience">
            {({ remove, push }) => (
              <div
                style={{
                  border: "1px solid grey",
                  marginTop: "10px",
                  padding: "10px",
                }}
              >
                <Label style={{ fontSize: "25px" }}>Experience</Label>
                <PrimaryButton
                  style={{ marginTop: "10px" }}
                  text="Add Experience"
                  onClick={() =>
                    push({
                      designation: "",
                      startDate: "",
                      endDate: "",
                      skills: [""],
                    })
                  }
                />
                {values.experience.map((experience: any, index: number) => (
                  <Stack key={index} tokens={{ childrenGap: 10 }}>
                    <Field
                      name={`experience[${index}].designation`}
                      as={TextField}
                      label="Designation"
                      required
                    />
                    <DatePicker
                      placeholder="Select Start Date"
                      label="Start Date"
                      onSelectDate={(date) =>
                        setFieldValue(`experience[${index}].startDate`, date)
                      }
                      isRequired
                    />
                    <DatePicker
                      placeholder="Select End Date"
                      label="End Date"
                      onSelectDate={(date) =>
                        setFieldValue(`experience[${index}].endDate`, date)
                      }
                      isRequired
                    />
                    <FieldArray name={`experience[${index}].skills`}>
                      {({ remove, push }) => (
                        <div>
                          <PrimaryButton
                            text="Add Skill"
                            onClick={() => push("")}
                          />
                          {experience.skills.map(
                            (_: any, skillIndex: number) => (
                              <Stack
                                key={skillIndex}
                                tokens={{ childrenGap: 5 }}
                              >
                                <Field
                                  name={`experience[${index}].skills[${skillIndex}]`}
                                  as={TextField}
                                  label={`Skill ${skillIndex + 1}`}
                                  required
                                />
                                <PrimaryButton
                                  style={{ width: "50px", marginLeft: "45%" }}
                                  text="Remove Skill"
                                  onClick={() => remove(skillIndex)}
                                />
                              </Stack>
                            )
                          )}
                        </div>
                      )}
                    </FieldArray>
                    <PrimaryButton
                      style={{ width: "50px" }}
                      text="Remove "
                      onClick={() => remove(index)}
                    />
                  </Stack>
                ))}
              </div>
            )}
          </FieldArray>
          <div style={{ marginTop: "30px", marginBottom: "20px" }}>
            <label style={{ fontWeight: "500" }}>Profile Picture: </label>
            <input
              required
              type="file"
              name="image"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  setFieldValue("image", file);
                  handleImagePreview(file, setProfileImagePreview);
                }
              }}
            />
            {profileImagePreview && (
              <div>
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  style={{ width: "100px", height: "100px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleImageDelete(
                      setProfileImagePreview,
                      setFieldValue,
                      "image"
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {/* Signature Upload */}
          <div>
            <label style={{ fontWeight: "500" }}>Signature: </label>
            <input
              required
              type="file"
              name="signature"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  setFieldValue("signature", file);
                  handleImagePreview(file, setSignatureImagePreview);
                }
              }}
            />
            {signatureImagePreview && (
              <div>
                <img
                  src={signatureImagePreview}
                  alt="Signature Preview"
                  style={{ width: "100px", height: "100px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleImageDelete(
                      setSignatureImagePreview,
                      setFieldValue,
                      "signature"
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <PrimaryButton
            style={{ marginTop: "30px" }}
            text="Submit"
            type="submit"
          />
        </Form>
      )}
    </Formik>
  );
};
export default AddResumePanel;
