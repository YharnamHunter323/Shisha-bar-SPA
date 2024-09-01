# Shisha Bar SPA

This repository contains two versions of a Single Page Application (SPA) for a Shisha Bar, built using Svelte and Vue.js, with Firebase as the backend.

## Project Overview
The Shisha Bar SPA is a single-page application designed to streamline the operations of a Shisha Bar by allowing users to book tables and view an up-to-date menu in real-time. The application is built in two versions, one using Svelte and the other using Vue.js, with Firebase serving as the backend for real-time data synchronization.
Features
  -Table Booking System: Users can book tables directly through the application. The available tables are updated live based on the number of people selected by the user, ensuring accurate and real-time availability information.
  -Live Menu: The application features a dynamic menu that updates live, allowing users to see the most current offerings without needing to refresh the page.
  -Admin Interface: Only the admin can log in to the system. Once logged in, the admin can modify the menu directly from the interface. Any changes made by the admin are immediately reflected in the database and visible to users in real-time.


### Svelte Version

This version of the Shisha Bar SPA is built using Svelte. It leverages the powerful features of Svelte for creating a fast and reactive user interface.

- [Svelte Version Documentation](./shisha_bar_svelte/README.md)

### Vue.js Version

This version of the Shisha Bar SPA is built using Vue.js. Vue.js provides a flexible and approachable framework for building modern web applications.

- [Vue.js Version Documentation](./shisha_bar_vue/README.md)

## Firebase Setup

Both versions use Firebase for authentication and database services. Ensure you have a Firebase project set up and add your Firebase configuration in the 'firebase.js' file loacated in the 'src/' of each project.

## Deployment

Both projects can be deployed using platforms like Vercel, Netlify, or Firebase Hosting. Follow the build instructions in each project's README.


