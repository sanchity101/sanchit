# Project Title

**Cloud File Storage System Using Firebase**

## Project Objective

To develop a cloud-based application that allows users to securely upload, store, view, download, and delete files from anywhere using cloud storage.

---

# Project Modules

### Module 1: User Registration

* Create a new account
* Enter Name, Email, Password
* Store user details in Firebase Authentication

### Module 2: User Login

* Login using Email and Password
* Verify user credentials
* Redirect to Dashboard

### Module 3: Dashboard

Display:

* Welcome message
* Upload File button
* My Files button
* Storage Usage (optional)
* Logout button

### Module 4: Upload File

* Select file from computer
* Validate file type
* Validate file size
* Upload to Firebase Storage
* Save file information in Firestore

### Module 5: My Files

Display all uploaded files in a table.

| File Name  | Type | Size   | Upload Date | Action   |
| ---------- | ---- | ------ | ----------- | -------- |
| Resume.pdf | PDF  | 520 KB | 20/07/2026  | Download |
| Notes.docx | DOCX | 200 KB | 21/07/2026  | Delete   |

### Module 6: Download File

* Click Download
* Retrieve file from Firebase Storage

### Module 7: Delete File

* Remove file from Firebase Storage
* Remove file record from Firestore

### Module 8: Search Files (Optional)

* Search files by name
* Filter file list instantly

### Module 9: User Profile (Optional)

* View Name
* Email
* Total Uploaded Files
* Total Storage Used

### Module 10: Logout

* End user session securely

---

# Project Workflow

```text
Start
   │
   ▼
Registration
   │
   ▼
Login
   │
   ▼
Dashboard
   │
   ├──────────────┐
   │              │
   ▼              ▼
Upload File   View My Files
   │              │
   ▼              ▼
Save to       Download/Delete
Firebase
   │
   ▼
Logout
```

---

# System Architecture

```text
                 +--------------------+
                 |       User         |
                 +---------+----------+
                           |
                           |
                      Internet
                           |
                           ▼
                +----------------------+
                |   Web Application    |
                | HTML CSS JavaScript  |
                +----------+-----------+
                           |
        +------------------+------------------+
        |                                     |
        ▼                                     ▼
+----------------------+          +----------------------+
| Firebase Auth        |          | Firebase Firestore  |
| Login & Signup       |          | File Information    |
+----------------------+          +----------+----------+
                                             |
                                             ▼
                                +-------------------------+
                                | Firebase Storage        |
                                | Uploaded Files          |
                                +-------------------------+
```

---

# Database Design

## Users Collection

| Field  | Type   |
| ------ | ------ |
| userId | String |
| name   | String |
| email  | String |

## Files Collection

| Field       | Type   |
| ----------- | ------ |
| fileId      | String |
| fileName    | String |
| fileType    | String |
| fileSize    | Number |
| uploadDate  | Date   |
| downloadURL | String |
| userId      | String |

---

# Software Requirements

* Visual Studio Code
* HTML
* CSS
* JavaScript
* Firebase
* Google Chrome

---

# Hardware Requirements

* Laptop/Desktop
* Internet Connection

---

# Cloud Services Used

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

---

# Security Features

* User authentication
* Only logged-in users can access the system
* Users can view only their own files
* HTTPS communication
* File type validation
* File size limit
* Firebase Security Rules

---

# Future Enhancements

* Create folders
* Share files with other users
* Image and PDF preview
* Search and filter files
* Drag-and-drop file upload
* Storage usage chart
* Email verification
* Password reset
* File version history
* Mobile application

---

# Expected Output Screens

1. Home Page
2. Registration Page
3. Login Page
4. Dashboard
5. Upload File Page
6. My Files Page
7. Search Files Page (Optional)
8. User Profile Page (Optional)

---

# Viva Questions You May Be Asked

1. What is cloud storage?
2. Why did you choose Firebase?
3. What is Firebase Storage?
4. What is Firestore?
5. How is user data secured?
6. What is the difference between Firestore and Firebase Storage?
7. Why is authentication important?
8. What are the advantages of cloud storage?
9. How can this project be improved?
10. What security measures have you implemented?
