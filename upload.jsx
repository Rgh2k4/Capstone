export function setupUploadEvents() {
    //This code was written by Robert in one of his previous classes
    
    //This code sets up the event listeners for the upload sidebar

    //Place Holder: to contain the path to our database
    //const storage = firebase.app().storage("");
    const fileInput = document.getElementById("upload-file");
    const preview = document.getElementById("file-preview");
    const labelText = document.getElementById("file-label-text");
    const uploadButton = document.getElementById("upload-button");

    if (!fileInput || !preview || !uploadButton) {
        console.warn("Upload elements not yet in DOM.");
        return;
    }

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.classList.remove("hidden");
            labelText.classList.add("hidden");
        } else {
            preview.src = "";
            preview.classList.add("hidden");
            labelText.classList.remove("hidden");
        }
    });

    uploadButton.addEventListener("click", async () => {
        const file = fileInput.files[0];
        const location = document.getElementById("photo-location").value.trim();
        const user = firebase.auth().currentUser;

        if (!file) return alert("Please select a file.");
        if (!user) return alert("You must be logged in.");

        try {
            const storageRef = storage.ref(`uploads/${user.uid}/${file.name}`);
            await storageRef.put(file, { customMetadata: { location } });

            alert("Upload successful!");
            document.getElementById("upload-sidebar").classList.add("translate-x-full");
        } catch (err) {
            console.error("Upload error", err);
            alert("Upload failed: " + err.message);
        }
    });

    document.getElementById("close-upload")?.addEventListener("click", closeSidebar);
    document.getElementById("cancel-upload")?.addEventListener("click", closeSidebar);
}

function closeSidebar() {
    const sidebar = document.getElementById("upload-sidebar");
    sidebar?.classList.add("translate-x-full");
    setTimeout(() => {
        document.getElementById("upload-container").innerHTML = "";
    }, 300);
}
