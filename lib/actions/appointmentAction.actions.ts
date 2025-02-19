"use server"

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";


export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newPatient = await databases.createDocument(
            '67933a39003596f66595',  // DATABASE_ID!,
            '67937fc90011349701dc', //APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );

        return parseStringify(newPatient)

    } catch (error) {
        console.log("error registering patient", error);
    }
}

export const getApointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            "67933a39003596f66595", //DATABASE_ID
            "67937fc90011349701dc", //APPOINTMENT_COLLECTION_ID
            appointmentId,
        )
        return parseStringify(appointment);

    } catch (error) {
        console.error(error)
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }
        
        // It uses reduce() to iterate through all appointments and accumulate counts
        const counts = (appointments.documents as Appointment[]).reduce(( acc, appointment) => {
            switch (appointment.status) {
                case "scheduled":
                  acc.scheduledCount++;
                  break;
                case "pending":
                  acc.pendingCount++;
                  break;
                case "cancelled":
                  acc.cancelledCount++;
                  break;
              }
              return acc;
        }, initialCounts);

            const data = {
                totalCount : appointments.total,
                ...counts,
                documents: appointments.documents,
            }

            return parseStringify(data);
    } catch (error) {
        console.log("Error in getRecentAppointment:",error)
    }
}

export const updateAppointment = async({appointmentId, userId, appointment, type}:updateAppointmentParams) =>{
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updatedAppointment){
            throw new Error('Appointment not found');
        }

        //sms notification

        revalidatePath('/admin');
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log(error)
    }
}