# Scheduler

Scheduler is a single page interview scheduling app built with React. 

![gif of appointment creation](https://github.com/charcharmasonjar/scheduler/blob/master/public/images/createAppt.gif)

Storybook, Jest tests, and Cypress were used in the development of the project.

Data is persisted by the API server using a PostgreSQL database. 


![gif of appointment edit and delete](https://github.com/charcharmasonjar/scheduler/blob/master/public/images/editAppt.gif)

## Getting started

Install dependencies with `npm install`.

Fork and clone the scheduler-api and follow its set-up instructions:

https://github.com/lighthouse-labs/scheduler-api

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Technical Specifications
- React
- Webpack, Babel
- Axios
- Storybook, Webpack Dev Server, Jest, Testing Library

The Scheduler client application was created using Create React App. Express is the basis for the Scheduler API server application.

## Dependencies
- axios
- @testing-library/react-hooks
- react-test-renderer