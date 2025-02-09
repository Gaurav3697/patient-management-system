"use client";

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
} from "@/components/ui/form"
import { CustomFormfield } from "@/components/ui/CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointmentAction.actions";

const AppointmentForm = ({ userId, patientId, type }: {
  userId: string,
  patientId: string,
  type: "create" | "cancel" | "schedule"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const AppointmentFormValidation = getAppointmentSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
      primaryPhysician:"",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {

    setIsLoading(true);
    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;

      case 'cancel':
        status = 'cancelled';
        break;

      default:
        status = 'pending'
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient:patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason:values.reason!,
          note: values.reason,
          status: status as Status,
        }
        const appointment = await createAppointment(appointmentData);

        if(appointment){
          form.reset();
          router.push(`/patient/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      }


    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = 'cancel Appointment';
      break;

    case "create":
      buttonLabel = 'Create Appointment';
      break;

    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;

    default:
      break;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <section className="mb-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 second</p>
        </section>

        {type !== "cancel" && (
          <>
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

            <CustomFormfield
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy -h:mm aa"
            />

            <div className="flex flex-col gap-6 md:flex-row">
              <CustomFormfield
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason For Appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormfield
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}

        {
          type === "cancel" && (
            <CustomFormfield
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="cancellationReason"
              label="Reason For Cancellation"
              placeholder="Enter reason for cancellation"
            />
          )
        }


        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`} >Get Started</SubmitButton>

      </form>
    </Form>
  )
}

export default AppointmentForm
