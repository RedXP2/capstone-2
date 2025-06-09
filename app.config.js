// Import app.json values
const appJson = require('./app.json');

export default {
  ...appJson.expo,
  // Override specific values
  android: {
    ...appJson.expo.android,
    package: "com.musclerecovery.app",
    edgeToEdgeEnabled: true
  }
};