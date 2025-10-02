import { database } from "./databaseIntegration";
import { collection, addDoc } from "firebase/firestore";


export async function addData(userID, data) {

    try {
        const refId = await addDoc(collection(database, "users", userID, "reviewData"), data);
        return refId;
    } catch (error) {
        console.error("Error: ", error);
    }
}