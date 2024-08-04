# Firebase Authentication Example

## Getting Started & Running The Project

### Installing Dependencies

- Make sure you have [Node.js 20](https://nodejs.org/en) installed. To help manage multiple node versions
  simultaneously, see [NVM](https://github.com/nvm-sh/nvm).
- run `npm install` at the root of the project

## Configuring Environment Variables

- Create a file named `.env` at the root of the project.
- This file is ignored by git and contains the environment variables necessary to hold authentication secrets and other
  configuration values.
- The first set of values can be obtained by creating a firebase project
  and [registering your app](https://firebase.google.com/docs/web/setup#register-app).
- The second set of firebase values are required for firebase admin operations (verifying tokens and changing
  passwords). These can be obtained by navigating to your project on firebase, clicking the gear icon next to "Project
  Overview", clicking "Project Settings" and finally generating a private key under the "Accounts" tab.
- Finally, the `NEXT_PUBLIC_API_URL` value is simply the hosting domain of the application, which
  is http://localhost:3000 when running locally.

## Running

- The project can be run by executing `npm run dev` at the root of the project.
- It should be available at http://localhost:3000

## CI & Versioning

- Linting & Unit tests have been set up in GitHub actions
- Additionally, automatic tagging through semantic release takes effect on every passing push to main
- This eliminates the toil of manual versioning and works based
  on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Features

- User sign up, log in & log out
- Session persistence and user token validation through cookies
- User password modification
- Server-based page protection and redirection for unverified users
- Server side validation for email and password criteria

## Design Decisions

### Next.js & Server Components

- While it would be possible to create a separate back end project with a library such as express and set up a
  development proxy for the front end to access, Next.js offers a much more streamlined approach to developing
  full-stack web apps.
- Additionally, it offers built-in sass support (with the ability to utilize tailwind css as well).
- It also defaults to server-rendered components, which can improve speed and search engine discovery.
- Finally, it offers server-side navigation and page protection, which is superior to client-side route protection in
  terms of ease of development and end-user experience.

### Next.js API routes and authentication handling

- While firebase technically supports client-side authentication, bundling credentials (even though they are regarded
  non-sensitive in the case of firebase) is a poor design decision and allows for potential abuse.
- Therefore, API routes were created to interface with back end services and securely store credentials in environment
  variables.

### Service Registry Pattern & Dependency Inversion

- There is nothing inherently firebase specific about the vast majority of this application.
- All firebase operations have been implemented behind a `UserManagementService` interface.
- In the future, any back end implementing this interface could be used.
- A similar dependency inversion has been implemented for email and password validation.

## Preview


https://github.com/user-attachments/assets/3baefdd8-79eb-49f7-92ef-98d8f321d423

