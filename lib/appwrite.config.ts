import * as sdk from "node-appwrite";

export const {
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

// console.log(
//     "ENDPOINT:",ENDPOINT,
//     "PROJECT_ID:",PROJECT_ID,
//     "API_KEY:",API_KEY,
//     "DATABASE_ID:",DATABASE_ID,
//     "PATIENT_COLLECTION_ID:",PATIENT_COLLECTION_ID,
//     "DOCTOR_COLLECTION_ID:",DOCTOR_COLLECTION_ID,
//     "APPOINTMENT_COLLECTION_ID:",APPOINTMENT_COLLECTION_ID,
//     "BUCKET_ID,:",BUCKET_ID,)

client
    .setEndpoint(ENDPOINT!) // Your API Endpoint
    .setProject(PROJECT_ID!) // Your project ID
    .setKey(API_KEY!); // Your secret API key

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
