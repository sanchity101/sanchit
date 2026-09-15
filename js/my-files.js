import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { collection, query, where, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { ref, deleteObject } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const fileListContainer = document.getElementById('file-list');
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadFiles();
    } else {
        currentUser = null;
        if(fileListContainer) fileListContainer.innerHTML = '';
    }
});

function getFileIcon(type) {
    if (type.includes('image')) return { icon: 'image', bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' };
    if (type.includes('pdf')) return { icon: 'picture_as_pdf', bg: 'bg-error-container', text: 'text-on-error-container' };
    if (type.includes('video')) return { icon: 'movie', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' };
    if (type.includes('audio')) return { icon: 'audiotrack', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' };
    return { icon: 'description', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' };
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadFiles() {
    if (!fileListContainer) return;
    fileListContainer.innerHTML = '<div class="p-md text-center text-on-surface-variant">Loading files...</div>';

    try {
        const filesRef = collection(db, "Files");
        const q = query(filesRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        fileListContainer.innerHTML = '';

        if (querySnapshot.empty) {
            fileListContainer.innerHTML = '<div class="p-md text-center text-on-surface-variant">No files found.</div>';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const fileId = docSnap.id;
            const styling = getFileIcon(data.fileType);

            const fileHTML = `
            <div class="grid grid-cols-12 gap-4 px-md py-3 items-center hover:bg-surface-container-low transition-colors group">
                <div class="col-span-6 md:col-span-5 flex items-center gap-3">
                    <div class="w-10 h-10 rounded ${styling.bg} ${styling.text} flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined">${styling.icon}</span>
                    </div>
                    <div class="truncate">
                        <p class="font-body-md text-body-md text-on-surface font-medium truncate" title="${data.fileName}">${data.fileName}</p>
                    </div>
                </div>
                <div class="hidden md:flex col-span-2 items-center">
                    <span class="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-label-sm truncate max-w-full">${data.fileType.split('/')[1] || 'File'}</span>
                </div>
                <div class="col-span-3 md:col-span-2 flex items-center font-body-sm text-body-sm text-on-surface-variant">
                    ${formatBytes(data.fileSize)}
                </div>
                <div class="hidden md:flex col-span-2 items-center font-body-sm text-body-sm text-on-surface-variant">
                    ${formatDate(data.uploadedAt)}
                </div>
                <div class="col-span-3 md:col-span-1 flex justify-end items-center gap-2 relative">
                    <a href="${data.downloadURL}" target="_blank" class="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container-highest transition-colors" title="Download">
                        <span class="material-symbols-outlined text-[20px]">download</span>
                    </a>
                    <button onclick="deleteFile('${fileId}', '${data.storagePath}')" class="text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-error-container transition-colors" title="Delete">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </div>
            `;
            fileListContainer.insertAdjacentHTML('beforeend', fileHTML);
        });

    } catch (error) {
        console.error("Error loading files:", error);
        fileListContainer.innerHTML = '<div class="p-md text-center text-error">Error loading files.</div>';
    }
}

// Make delete function available globally so inline onclick can see it
window.deleteFile = async function(docId, storagePath) {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
        // Delete from Storage
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);

        // Delete from Firestore
        await deleteDoc(doc(db, "Files", docId));

        // Reload the list
        loadFiles();
    } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
    }
};
