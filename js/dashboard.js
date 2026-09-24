import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// DOM Elements
const welcomeMessage = document.querySelector('.font-headline-lg.text-on-background.mb-base');
const totalFilesElement = document.querySelectorAll('.font-headline-lg.text-on-background')[1]; // The '24' Total Files
const storageTextElement = document.querySelector('.font-display-lg'); // The '1.8 GB'
const recentUploadsElement = document.querySelectorAll('.font-headline-lg.text-on-background')[2]; // The '5' Recent Uploads

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Fetch user document from Firestore to get their real name
        try {
            const userDoc = await getDoc(doc(db, "Users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const firstName = userData.name ? userData.name.split(' ')[0] : 'User';
                if (welcomeMessage) {
                    welcomeMessage.textContent = `Good Morning, ${firstName}`;
                }
            } else {
                if (welcomeMessage) {
                    welcomeMessage.textContent = `Good Morning, User`;
                }
            }

            // Fetch file stats from Firestore (Files collection)
            const filesRef = collection(db, "Files");
            const q = query(filesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            
            const totalFiles = querySnapshot.size;
            let totalBytes = 0;
            
            querySnapshot.forEach((doc) => {
                totalBytes += doc.data().fileSize || 0;
            });

            // Convert bytes to MB/GB
            let storageString = "0 MB";
            if (totalBytes > 0) {
                const mb = totalBytes / (1024 * 1024);
                if (mb > 1024) {
                    storageString = (mb / 1024).toFixed(2) + " GB";
                } else {
                    storageString = mb.toFixed(2) + " MB";
                }
            }

            if (totalFilesElement) totalFilesElement.textContent = totalFiles.toString();
            if (recentUploadsElement) recentUploadsElement.textContent = totalFiles.toString(); // For now, just show total as recent
            if (storageTextElement) storageTextElement.textContent = storageString;

            // Populate recent files table
            const recentFilesTable = document.getElementById('recent-files');
            if (recentFilesTable) {
                recentFilesTable.innerHTML = '';
                let count = 0;
                querySnapshot.forEach((docSnap) => {
                    if (count >= 5) return; // Show max 5
                    const data = docSnap.data();
                    
                    let icon = 'description';
                    let bg = 'bg-surface-tint/10';
                    let text = 'text-surface-tint';
                    
                    if (data.fileType.includes('pdf')) { icon = 'picture_as_pdf'; bg = 'bg-primary/10'; text = 'text-primary'; }
                    if (data.fileType.includes('image')) { icon = 'image'; bg = 'bg-secondary/10'; text = 'text-secondary'; }

                    const tr = document.createElement('tr');
                    tr.className = 'border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors group';
                    
                    let dateStr = 'Just now';
                    if (data.uploadedAt) {
                        dateStr = data.uploadedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }

                    tr.innerHTML = `
                        <td class="p-md flex items-center gap-sm">
                            <span class="material-symbols-outlined ${text} ${bg} p-1 rounded">${icon}</span>
                            <span class="font-medium text-on-background truncate max-w-[150px]" title="${data.fileName}">${data.fileName}</span>
                        </td>
                        <td class="p-md text-on-surface-variant capitalize">${data.fileType.split('/')[1] || 'File'}</td>
                        <td class="p-md text-on-surface-variant">${(data.fileSize / (1024*1024)).toFixed(2)} MB</td>
                        <td class="p-md text-on-surface-variant hidden sm:table-cell">${dateStr}</td>
                        <td class="p-md text-right">
                            <a href="${data.downloadURL}" target="_blank" class="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                <span class="material-symbols-outlined">download</span>
                            </a>
                        </td>
                    `;
                    recentFilesTable.appendChild(tr);
                    count++;
                });

                if (count === 0) {
                    recentFilesTable.innerHTML = '<tr><td colspan="5" class="p-md text-center text-on-surface-variant">No files uploaded yet.</td></tr>';
                }
            }

        } catch (error) {
            console.error("Error fetching dashboard data: ", error);
        }
    }
});
