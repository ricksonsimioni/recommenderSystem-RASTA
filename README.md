# recommenderSystem-RASTA

This project is a web-based recommender system prototype developed as part of the project Realtà Aumentata e Story-Telling Automatizzato per la valorizzazione di Beni Culturali ed Itinerari (RASTA). It provides personalised itinerary suggestions based on user preferences such as fitness level, available duration, and optional criteria like crowd levels and weather conditions.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.  
It connects to the RASTA PMS backend and is configured via proxy.

The page will reload on changes.  
Lint errors will appear in the console.

### `npm test`

Launches the test runner in interactive watch mode.  
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests).

### `npm run build`

Builds the app for production to the `build` folder.  
It bundles React in production mode and optimises the build for performance.  
The build is minified and includes hashed filenames.

See [deployment](https://facebook.github.io/create-react-app/docs/deployment).

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

Use only if you need to modify build tools directly (webpack, Babel, ESLint, etc).  
All commands will still work, but reference the copied configuration.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)

### Code Splitting

[Learn more](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analysing the Bundle Size

[Learn more](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

[Learn more](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

[Learn more](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

[Learn more](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

[Troubleshooting guide](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Purpose

This UI supports experimentation with adaptive nature-based itinerary recommendations. It allows testing of:

- Fitness and duration-based filtering of itineraries
- Inclusion/exclusion of POIs by user selection
- Optional constraints like crowdedness and weather
- Map-based visualisation of selected routes
- Integration with simulated sensor data from PMS

## Functional Overview

- **Preferences Page**: Form interface where users select fitness level (Beginner, Intermediate, Advanced), max duration, and constraints (e.g. avoid crowded places).
- **Recommendations Page**: Displays top 5 itineraries sorted by preference fit. Routes visualised on OpenStreetMap.
- **POI List Page**: Interactive POI selection. Selected POIs influence the recommendation logic.
- **Itinerary List Page**: Shows all available itineraries fetched from the backend, for inspection or manual comparison.

## Technologies

- **React** for UI rendering
- **Leaflet + React-Leaflet** for map integration
- **REST API** communication with PMS backend
- **Axios** for HTTP requests
- **Tailwind CSS** (if installed) for styling (optional)
