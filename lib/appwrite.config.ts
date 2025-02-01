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

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('6793391400193663e507') // Your project ID
    .setKey('standard_4dbd5ac7e83d1d66029de0e2f26694e98c877e1b29a0b159c19e99d577f059e343065c843a7b4769030de43576b26af5e884c00e72f7fb8b65ef0215adf090cdbdfe28fe50a57c1a9ce7ed44c951712b7c9532808f1c277b39f8e30035969b36eb50dd1ca632de9e661859545cf7dd3e924d5cbcca5be5014716e775b70094ef'); // Your secret API key

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
