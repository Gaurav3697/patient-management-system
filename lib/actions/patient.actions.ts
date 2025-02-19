"use server"
import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { InputFile } from "node-appwrite/file"
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return JSON.parse(JSON.stringify(newuser));
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};


export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log("error getting user", error);
  }
}

export const getPatient = async (userId: string) => {
  try {
    console.log(userId)
    const patients = await databases.listDocuments(
      "67933a39003596f66595", //database_id
      "67937f650030f2c4c3ac", //PATIENT_COLLECTION_ID
      [
        Query.equal("user_id", [userId]),
      ]
    );
    return parseStringify(patients.documents[0])
  } catch (error) {
    console.log("error getting user", error);
  }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputfile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string,
      )

      // file = await storage.createFile(BUCKET_ID!, ID.unique(), inputfile)
      file = await
        // storage.createFile("67938063002cd236048a", ID.unique(), inputfile)
        storage.createFile(
          '67938063002cd236048a',
          ID.unique(),
          inputfile
        );
    }
    const newPatient = await databases.createDocument(
      '67933a39003596f66595',  // DATABASE_ID!,
      '67937f650030f2c4c3ac', //PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        // identificationDocumentURL: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        identificationDocumentUrl: file ? `https://cloud.appwrite.io/v1/storage/buckets/67938063002cd236048a/files/${file?.$id}/view?project=6793391400193663e507` : " ",
        ...patient
      }
    );

    return parseStringify(newPatient)

  } catch (error) {
    console.log("error registering patient", error);
  }
}

