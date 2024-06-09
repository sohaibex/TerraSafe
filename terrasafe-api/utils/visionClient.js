// utils/visionClient.js
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'path-to-your-google-cloud-key.json'
});

module.exports = client;
