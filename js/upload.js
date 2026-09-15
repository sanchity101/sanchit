import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-upload');
const uploadList = document.getElementById('upload-list');
const uploadCount = document.getElementById('upload-count');

let currentUser = null;
let activeUploads = 0;

// Listen for auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = null;
    }
});

// Drag and drop styles
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('border-primary', 'bg-surface-container-low');
    dropZone.classList.remove('border-primary/40');
}

function unhighlight(e) {
    dropZone.classList.remove('border-primary', 'bg-surface-container-low');
    dropZone.classList.add('border-primary/40');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change', function(e) {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (!currentUser) {
        alert("Please log in to upload files.");
        return;
    }
    ([...files]).forEach(uploadFile);
}

function getFileIcon(type) {
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('video')) return 'movie';
    if (type.includes('audio')) return 'audiotrack';
    return 'description';
}

function uploadFile(file) {
    // 50MB Limit
    if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 50MB limit.`);
        return;
    }

    activeUploads++;
    updateUploadCount();

    // Create UI Item
    const fileId = `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const uploadItemHTML = `
        <div id="${fileId}" class="bg-surface rounded-lg p-md border border-outline-variant/30 flex flex-col gap-sm relative overflow-hidden group">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-sm overflow-hidden">
                    <span class="material-symbols-outlined text-tertiary">${getFileIcon(file.type)}</span>
                    <p class="font-label-md text-label-md text-on-background truncate max-w-[200px]" title="${file.name}">${file.name}</p>
                </div>
            </div>
            <div class="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
                <span id="status-${fileId}">Uploading...</span>
                <span id="percentage-${fileId}">0%</span>
            </div>
            <div class="w-full bg-surface-variant rounded-full h-1 mt-xs">
                <div id="progress-${fileId}" class="bg-gradient-to-r from-primary to-secondary h-1 rounded-full" style="width: 0%"></div>
            </div>
        </div>
    `;
    
    uploadList.insertAdjacentHTML('afterbegin', uploadItemHTML);

    const statusEl = document.getElementById(`status-${fileId}`);
    const percentEl = document.getElementById(`percentage-${fileId}`);
    const progressEl = document.getElementById(`progress-${fileId}`);
    const containerEl = document.getElementById(fileId);

    // Upload to Firebase Storage
    const storageRef = ref(storage, `users/${currentUser.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            percentEl.textContent = Math.round(progress) + '%';
            progressEl.style.width = progress + '%';
        }, 
        (error) => {
            console.error("Upload error:", error);
            statusEl.textContent = "Error";
            statusEl.classList.add('text-error');
            activeUploads--;
            updateUploadCount();
        }, 
        async () => {
            // Upload completed successfully
            statusEl.textContent = "Complete";
            percentEl.innerHTML = '<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>';
            containerEl.classList.remove('border-outline-variant/30');
            containerEl.classList.add('border-primary/20', 'bg-surface-container-low', 'opacity-70');

            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // Save to Firestore
                await addDoc(collection(db, "Files"), {
                    userId: currentUser.uid,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    downloadURL: downloadURL,
                    uploadedAt: serverTimestamp(),
                    storagePath: uploadTask.snapshot.ref.fullPath
                });
            } catch (err) {
                console.error("Error saving file metadata:", err);
            }

            activeUploads--;
            updateUploadCount();
        }
    );
}

function updateUploadCount() {
    uploadCount.textContent = activeUploads.toString();
    if (activeUploads > 0) {
        uploadCount.classList.remove('bg-surface-variant', 'text-on-surface-variant');
        uploadCount.classList.add('bg-primary-container', 'text-on-primary-container');
    } else {
        uploadCount.classList.add('bg-surface-variant', 'text-on-surface-variant');
        uploadCount.classList.remove('bg-primary-container', 'text-on-primary-container');
    }
}
