// // backend/api/index.js
// import serverlessExpress from "@vendia/serverless-express";
// import app from "../server"; // Import app Express của bạn

// export default serverlessExpress({ app });

// api/index.js
const serverless = require("serverless-http");
const app = require("../server");

module.exports = serverless(app);
