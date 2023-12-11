# BookNook

## Developing an application with Node.js, Express, Firebase, and React Native

### Project Setup

1. Navigate to the `Backend` and `React Native` folders.
2. Run `npm install` in both folders to install dependencies.

### Running the Project

After installing dependencies in both folders:

1. In the `Backend` folder, use `npm start` to initiate the server.
2. In `React Native`, use `npm start` to start the project, where Metro will provide options to choose between Android or IOS for emulating the application.

### System Requirements

To use BookNook, ensure your system meets the following requirements:

- Node.js and npm installed
- Firebase account for database setup
- Android Studio or Xcode for emulator options in React Native

## Database Setup

To create a Firestore database for BookNook:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "Firestore Database" in the left sidebar in the "Compilation" section.
4. Click on "Create Database" and choose a location.
5. Start in test mode for simplicity or set up security rules according to your needs.

#### Create Collection and First Document

6. Create a collection called "library".
7. Create the first document with the structure: "name", "cover", "description" & "author" as strings and "publication_year" as number.

- (You can leave the fields empty and add the books from the application later).

8. Once the database is created, go to Project Settings, then Service Account.
9. Under Firebase Admin SDK, click on "Generate New Private Key."
10. This will download a file. Rename it to `serviceAccountKey.json` and place it in the `Backend` folder.
11. Your Firestore database is now set up for BookNook!

#### Generate Sample Books

In the React Native folder, find the file `generateBooks.js`. This file allows you to create 10 sample books automatically in your database.

To run the file, use the following command in your terminal:

```bash
node generateBooks.js
```

### Features

- **Edit and Delete Books:** Each book in the interface has dedicated buttons for editing and deleting.

- **Image Zoom:** Tap on a book's image to view it in detail.

- **Detailed Information:** Clicking on the title of a book provides detailed information.

- **Add Books:** Use the "Add" button to add new books.
