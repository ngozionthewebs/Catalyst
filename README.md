
<div align="left">
</div><img width="1920" height="474" alt="Catalyst" src="https://github.com/user-attachments/assets/41ef9dc7-857e-41a3-94a5-083ec6f6f328" />

<br>
<h1 align="left">Catalyst - Shake Up Your Creative Process</h1>

<br>
<div align="left">
  A mobile application designed to spark creativity for artists, writers, and designers by <br> providing tailored, interactive prompts. Built with React Native and powered by Firebase.
</div>

<br>
<div align="left">
  <!-- BADGES PLACEHOLDER -->
  <!-- These badges are pre-configured. You can add more if you like! -->
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
</div>

<br>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>📑 <strong>Table of Contents</strong> (Click to expand)</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#project-description">Project Description</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a>
        <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#how-to-install">How to Install</a></li>
      </ul>
    </li>
    <li><a href="#features--usage">Features & Usage</a></li>
    <li><a href="#demonstration">Demonstration</a></li>
    <li><a href="#architecture--system-design">Architecture / System Design</a></li>
    <li><a href="#unit-testing--user-testing">Unit Testing & User Testing</a></li>
    <li><a href="#highlights--challenges">Highlights & Challenges</a></li>
    <li><a href="#roadmap--future-implementations">Roadmap & Future Implementations</a></li>
    <li><a href="#contributing--licenses">Contributing & Licenses</a></li>
    <li><a href="#authors--contact-info">Authors & Contact Info</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

---

## About The Project

### ↳ 1.1 Project Description

**Catalyst** is a mobile application designed to be the ultimate cure for creative block. It serves as an interactive partner in a creative's journey, providing an initial spark of inspiration through tailored, dynamic prompts. I chose the name "Catalyst" because it perfectly describes the app's mission: to initiate a creative reaction without being prescriptive.

The core concept is to move beyond static, boring lists of ideas. Catalyst makes finding inspiration a fun, physical, and surprising interaction. By physically shaking their device, users can generate new prompts that are personalized based on their chosen creative disciplines, helping them to start creating instantly.

### ↳ 1.2 Built With

This project leverages a modern, cross-platform mobile development stack.

*   **[React Native](https://reactnative.dev/)**: For building a single codebase that runs on both iOS and Android.
*   **[Expo](https://expo.dev/)**: To streamline the development, build, and deployment process.
*   **[TypeScript](https://www.typescriptlang.org/)**: For robust, type-safe code that is easier to scale and maintain.
*   **[Firebase](https://firebase.google.com/)**: Used as the comprehensive backend-as-a-service (BaaS).
    *   **Firebase Authentication**: For secure user sign-up, login, and session management.
    *   **Cloud Firestore**: As the NoSQL database for storing user profiles, preferences, and saved prompts.
*   **[React Navigation](https://reactnavigation.org/)**: For handling all routing and screen transitions.
*   **[Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur-view/)**: To create the modern "glassmorphism" UI effects.
*   **[Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)**: To access the device's accelerometer for the shake-to-generate feature.

---

## Getting Started

### ↳ 2.1 Prerequisites

To run this project locally, you will need the following installed on your machine:
*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Git](https://git-scm.com/)
*   [Expo Go](https://expo.dev/client) app on your physical iOS or Android device.

### ↳ 2.2 How to Install

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ngozionthewebs/Catalyst.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Catalyst
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Set up your Firebase configuration:**
    *   Create a `src/firebase.ts` file.
    *   Copy your Firebase project's web configuration object into this file.
5.  **Start the development server:**
    ```bash
    npx expo start --clear
    ```
6.  Scan the QR code with the Expo Go app.

---

## Features & Usage

*   **Secure User Authentication**: Full sign-up and login functionality powered by Firebase. User sessions persist between app launches.
*   **Personalised Onboarding**: A one-time, multi-step onboarding flow for new users to select their creative disciplines.
*   **Database-Driven Prompts**: The app fetches prompts from a master collection in Firestore, tailored specifically to the user's selected disciplines.
*   **Shake-to-Generate**: The core interactive feature. Physically shaking the device triggers the generation of a new, random prompt.
*   **Full CRUD Functionality**: Users can **C**reate (Save), **R**ead (View), **U**pdate (Add Notes), and **D**elete their saved prompts.
*   **Real-time Database Sync**: The list of saved prompts uses a real-time listener, so changes are reflected instantly across the app.
*   **Custom UI/UX**: A fully custom-designed interface, including a floating glassmorphism tab bar and consistent branding across all screens.

---

## Demonstration

You can find my Demo Video Here: 
    ```
     https://youtu.be/UVR-lt00wqk
    ```

---

## Architecture / System Design

The application is built on a centralized navigation architecture controlled by `AppNavigator.tsx`.

1.  **Centralized Auth Listener**: The `AppNavigator` uses a real-time `onAuthStateChanged` listener from Firebase. When the app starts, this listener determines if a user is logged in.
2.  **Firestore Profile Check**: If a user is logged in, the navigator immediately performs a `onSnapshot` check on that user's profile document in Firestore to see if their `hasCompletedOnboarding` flag is true.
3.  **Conditional Stack Rendering**: Based on the auth and onboarding status, the navigator renders one of two main stacks:
    *   **AuthStack**: A stack navigator containing the Login, Sign Up, and multi-step Onboarding screens.
    *   **AppStack**: A stack navigator containing the main application, which is a nested Bottom Tab Navigator.
4.  **Decoupled Screens**: The individual screens (Login, SignUp, etc.) are "dumb". They only perform their specific Firebase action (e.g., `signInWithEmailAndPassword`) and do not handle any navigation logic. The central `AppNavigator` reacts to the resulting state change and handles all routing. This creates a robust, predictable, and maintainable system.

---
## UI Designs
![1 copy](https://github.com/user-attachments/assets/a7744443-d027-47de-a0bc-f3721143a1c6)
![Free_Hand_Holding_iPhone_16_Pro_Mockup copy](https://github.com/user-attachments/assets/cb3747ba-acee-49b8-9dcf-7ccae01377bc)
![Free_iPhone_16_Mockup_2 copy](https://github.com/user-attachments/assets/f04e2f02-aa91-4f44-8541-74d92854d47e)
![Free_iPhone_16_Mockup_4 copy](https://github.com/user-attachments/assets/6cfd2313-d4a0-4ed1-b921-14f7d4fa2121)

---

## Unit Testing & User Testing

*   **Unit Testing**: I plan to use Jest and React Native Testing Library to write unit tests for key helper functions, such as the prompt generation logic and form validation.
*   **User Testing**: I conducted informal user testing with peers, which led to key UI improvements such as adding an explicit "Next" button to the onboarding flow and refining the home screen layout for better clarity.

---

## Highlights & Challenges

*   **Highlight - Centralized Navigation**: Implementing the smart `AppNavigator` with a real-time Firestore listener was a major breakthrough. It solved complex race conditions and simplified the logic in all other components, making the entire app more robust.
*   **Highlight - Custom UI**: Building the custom floating glassmorphism tab bar was a challenging but rewarding task that significantly elevated the app's visual polish and professional feel.
*   **Challenge - Dependency Versioning**: I encountered significant challenges with dependency versions, particularly between Firebase, React Native Reanimated, and various UI libraries. Overcoming these issues required careful debugging, clearing caches, and sometimes locking in specific package versions to ensure a stable environment. This was a valuable lesson in modern JavaScript development.

---

## Roadmap & Future Implementations

*   [ ] **Animated Backgrounds**: Re-implement the animated "aura" effect for all screen backgrounds.
*   [ ] **Premium Prompts**: Add a feature for "Premium Prompt Packs" for niche creative fields, potentially as an in-app purchase.
*   [ ] **Community Features**: Allow users to submit their own prompts and vote on them.
*   [ ] **"My Work" Tab**: Add a new tab where users can save images or text snippets of the work they created based on a prompt.

---

## Contributing & Licenses

Contributions are welcome. Please open an issue to discuss what you would like to change. This project is licensed under the MIT License.

---

## Authors & Contact Info

*   **Ngozi Ojukwu** - [GitHub Profile](https://github.com/ngozionthewebs) - [Email](ngozionthewebs@gmail.com)

---

## Acknowledgements

*   My Interactive Development 300 lecturer, Armand Pretorius.
*   The open-source community for providing amazing libraries like React Native, Firebase, and Expo.
