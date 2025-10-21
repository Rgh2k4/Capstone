"use client";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './databaseIntegration';
import { useState, useEffect } from 'react';

export async function uploadImage(file, location) {
  try {
    const storagePath = ref(storage, `National/${location}/${file.name}`);
    await uploadBytes(storagePath, file);
    alert("Success!");
  } catch (error) {
    console.error('Error:', error);
  }
}

export function PullImage() {
    const [images, setImages] = useState([]);

    async function generateImage() {
        try {
            const imagesPath = ref(storage, 'National');
            const imageList = await listAll(imagesPath);
            const imageURL = await Promise.all(
                imageList.items.map((item) => getDownloadURL(item))
            );
            setImages(imageURL);
        } catch (error) {
        console.log("Error: ", error);
        } 
    }

    useEffect(() => {
        generateImage();
    }, []);

    return (
        <main>
            {images.map((image, keys) => (
                <img key={keys} src={image} alt={image.name} />
            ))}
        </main>
    );
}