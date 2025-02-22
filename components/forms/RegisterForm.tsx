"use client";

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
} from "@/components/ui/form"
import { CustomFormfield } from "@/components/ui/CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            // userId: user.$id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    });

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(!isLoading);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type })

            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileNmae', values.identificationDocument[0].name)
        }

        try {
            const patientData = {
                ...values,
                user_id: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
            }

// @ts-expect-error: Necessary due to type mismatch in registerPatient
const patient = await registerPatient(patientData);
            if (patient) {
                router.push(`/patient/${user.$id}/new-appointment`);
            }
        } catch (error) {
            console.log(error);

        }
        setIsLoading(false);

    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* title section */}
                <section className="mb-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">schedule your first appointment</p>
                </section>

                {/* name  */}
                <CustomFormfield
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                {/* email and phone */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="email"
                        label="Email"
                        placeholder="JohnDoe@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="user"
                    />

                    <CustomFormfield
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone number"
                        placeholder="(555) 123-4567 "
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="user"
                    />
                </div>

                {/* birthDate and gender*/}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.DATE_PICKER}
                        name="birthDate"
                        label="Date of Birth"
                        iconSrc="/assets/icons/calender.svg"
                        iconAlt=" "
                    />

                    <CustomFormfield
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option) => (
                                        <div className="radio-group" key={option}>
                                            <RadioGroupItem value={option} id={option} />
                                            <label htmlFor={option} className="cursor-point">{option}</label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                {/* address and occupation */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="address"
                        label="Adress"
                        placeholder="new road, kathmandu"
                    />

                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>

                {/* Emergency name and emergency number */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="emergencyContactName"
                        label="Emergency contact name"
                        placeholder="Guardian Name"
                    />

                    <CustomFormfield
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency Phone Number"
                        placeholder="(555) 123-4567 "
                    />
                </div>


                {/* Section of form for medical report */}
                <section className="mb-4">
                    <h2 className="sub-header">Medical Information</h2>
                </section>

                {/* PRIMARY CARE PHYSICIAN */}
                <CustomFormfield
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary care physician"
                    placeholder="Select a physician"
                >
                    {Doctors.map((doctor, i) => (
                        <SelectItem
                            key={doctor.name + i} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                    src={doctor.image}
                                    width={32}
                                    height={32}
                                    alt="doctor"
                                    className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormfield>

                {/* insurance */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="insuranceProvider"
                        label="Insurance provider"
                        placeholder="BlueCross BlueShield"
                    />

                    <CustomFormfield
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance policy number"
                        placeholder="ABC123456"
                    />
                </div>

                {/* allergies data */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="allergies"
                        label="Allergies(if any)"
                        placeholder="Peanuts , pollen"
                    />

                    <CustomFormfield
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, paracetamol 500mg"
                    />
                </div>

                {/* medical History */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <CustomFormfield
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="mother had diabeties and father had heart disease"
                    />

                    <CustomFormfield
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past medical History"
                        placeholder="Appendectomy, Tonsillectomy"
                    />
                </div>

                {/* Section of form for medical reportक */}
                <section className="mb-4">
                    <h2 className="sub-header">Identificationa nd verifiacation</h2>
                </section>

                {/* identifiaction feild */}
                <CustomFormfield
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification type"
                    placeholder="Select a identification type"
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type} >
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormfield>

                <CustomFormfield
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification number"
                    placeholder="123456789"
                />

                <CustomFormfield
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader file={field.value} onChange={field.onChange} />
                        </FormControl>
                    )} />


                <section className="mb-4">
                    <h2 className="sub-header">Consent and privacy</h2>
                </section>

                <CustomFormfield
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I concent to the treatment"
                />

                <CustomFormfield
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I concent to disclosure of information"
                />

                <CustomFormfield
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I concent to the treatment"
                />

                <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>

            </form>
        </Form>
    )
}

export default RegisterForm
