import { database } from "./databaseIntegration";
import { collection, addDoc, getDocs } from "firebase/firestore";


export async function addData(userID, reviewData) {

    try {
        const refId = await addDoc(collection(database, "users", userID, "review"), reviewData);
        return refId;
    } catch (error) {
        console.error("Error: ", error);
    }
}

export async function readData(userID) {
    const review = [];

    try {
        const reviewData = await getDocs(query(collection(database, "users", userID, "review")));
        reviewData.forEach((review) => {
            review.push({
                ...review.data()
            });
        });
    } catch (error) {
        console.error("Error: ", error);
    }

    return review;
}