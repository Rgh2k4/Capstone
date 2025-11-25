"use client";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './databaseIntegration';
import { useState, useEffect } from 'react';
import { updateProfileImageURL } from './database';

export async function uploadImage(file, location) {
  try {
    const storagePath = ref(storage, `National/${location}/${file.name}`);
    await uploadBytes(storagePath, file);
    alert("Success!");
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function uploadProfileImage(file, user) {
  try {
    const storagePath = ref(storage, `Profile/${user.uid}/${file.name}`);
    await uploadBytes(storagePath, file);
    updateProfileImageURL(user, file);
    alert("Success!");
  } catch (error) {
    console.error('Error:', error);
  }
}

export function PullProfileImage({ user, imageName }) {
    const [image, setImage] = useState(null);

    async function generateImage() {
        try {
            if (imageName === "") {
                setImage(null)
            }
            else {
                const imagePath = ref(storage, `Profile/${user.uid}/${imageName}`);
                const imageURL = await getDownloadURL(imagePath);
                setImage(imageURL);
            }          
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    useEffect(() => {
        generateImage();
    }, [imageName])

    if (!image) {
        return <img className="w-50 h-50 bg-gray-400 rounded-full" alt="profile picture" />
    }

    return <img src={image} className="w-50 h-50 bg-gray-400 rounded-full" alt="profile picture" />
   
}

export function PullImage({ location, url }) {
    const [images, setImages] = useState([]);

    async function generateImage() {
        try {
            const imagesPath = ref(storage, `National/${location}/`);
            const imageList = await listAll(imagesPath);
            imageList.items = imageList.items.filter(item => item.fullPath.endsWith(url));
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
                <img key={keys} src={image} alt={image.name} className='w-50 h-50 bg-gray-400 rounded'/>
            ))}
        </main>
    );
}

export function PullAllImages({ location }) {
    const [images, setImages] = useState([]);

    async function generateImage() {
        try {
            const imagesPath = ref(storage, `National/${location}/`);
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
                <img key={keys} src={image} alt={image.name} className='w-50 h-50 bg-gray-400 rounded'/>
            ))}
        </main>
    );
}