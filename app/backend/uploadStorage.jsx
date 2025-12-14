"use client";
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './databaseIntegration';
import { useState, useEffect } from 'react';
import { updateProfileImageURL, pullProfileImageURL } from './database';

// Utility function to get initials from email
function getEmailInitials(email) {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

// Utility function to get initials from UID when email is not available
function getUidInitials(uid) {
  if (!uid) return '?';
  return uid.charAt(0).toUpperCase();
}

export async function uploadImage(file, location) {
  try {
    const storagePath = ref(storage, `National/${location}/${file.name}`);
    await uploadBytes(storagePath, file);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function uploadProfileImage(file, user) {
  try {
    const storagePath = ref(storage, `Profile/${user.uid}/${file.name}`);
    await uploadBytes(storagePath, file);
    updateProfileImageURL(user, file);
    //alert("Success!");
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function removeImage(file, user) {
    try {
        const storagePath = ref(storage, `Profile/${user.uid}/${file}`);
        await deleteObject(storagePath);
    } catch (error) {
    console.error('Error:', error);
  }
}

export function PullProfileImageReview({ user }) {
    const [image, setImage] = useState(null);

    async function generateImage() {
        try {
            const imageName = await pullProfileImageURL(user);
            let trueImageName = imageName;
            

            if (imageName && typeof imageName.then === 'function') {
                    trueImageName = await imageName;
                }

            if (trueImageName === "" || !trueImageName) {
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
    }, [])

    if (!image) {
        // Try to use email first, fallback to uid if email not available
        const initial = user.email ? getEmailInitials(user.email) : getUidInitials(user.uid);
        return (
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{initial}</span>
            </div>
        );
    }

    return <img src={image} className="w-16 h-16 bg-gray-300 rounded-full" alt="profile" />
   
}

export function PullProfileImage({ user, imageName }) {
    const [image, setImage] = useState(null);

    async function generateImage() {
        try {
            let trueImageName = imageName;

            if (imageName && typeof imageName.then === 'function') {
                    trueImageName = await imageName;
                }

            if (trueImageName === "" || !trueImageName) {
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
        // Try to use email first, fallback to uid if email not available
        const initial = user.email ? getEmailInitials(user.email) : getUidInitials(user.uid);
        return (
            <div className="w-50 h-50 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-semibold">{initial}</span>
            </div>
        );
    }

    return <img src={image} className="w-50 h-50 bg-gray-400 rounded-full" alt="profile picture" />
   
}

export function PullProfileImageIcon({ user, imageName }) {
    const [image, setImage] = useState(null);

    async function generateImage() {
        try {
            let trueImageName = imageName;

            if (imageName && typeof imageName.then === 'function') {
                    trueImageName = await imageName;
                }

            if (trueImageName === "" || !trueImageName) {
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
        // Try to use email first, fallback to uid if email not available
        const initial = user.email ? getEmailInitials(user.email) : getUidInitials(user.uid);
        return (
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">{initial}</span>
            </div>
        );
    }

    return <img src={image} className="h-12 w-12 rounded-full bg-gray-300 object-cover" alt="profile picture" />
   
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