"use client"
 
import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
    {
      header: "#",
      cell: ({row}) => <p className="text-14-medium">{row.index + 1}</p>
    },
    {
      accessorKey: "patient",
      header: "patient",
      cell:({row})=> {
        const appointment = row.original;
        return <p className="text-14-medium">{appointment.patient.name}</p>
      }
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({row}) =>{
        const appointment = row.original;
        return(
          <div className="min-w-[115px]">
            <StatusBadge status={appointment.status} />
          </div>
        )
      }
    },
    {
      accessorKey:"schedule",
      header:"Appointment",
      cell:({row}) =>{
        const appointment = row.original;
        return(
          <p className="text-14-regular min-w-[100px]">
            {formatDateTime(appointment.schedule).dateTime}
          </p>
        )
      }
    },
    {
      accessorKey:"primaryPhysician",
      header: "Doctor",
      cell: ({row}) =>{
        const appointment = row.original;

        const doctor = Doctors.find(
          (doctor)=>doctor.name === appointment.primaryPhysician
        );
        return (
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-8"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
        );
      }
    }
  ]
export default columns
