const vision = require('@google-cloud/vision');
const path = require('path');
async function getLabels(imagefileName) {
    //ImageFileName
    // Creates a client
    try{
     const client = new vision.ImageAnnotatorClient({
         keyFilename:'./public/google_vision/mayorWilson.json'
     });
     // Performs label detection on the image file
     const [result] = await client.labelDetection('./public/resources/'+imagefileName);
     const labels = result.labelAnnotations;
     console.log('Labels:');
     labels.forEach(label => console.log(label.description));
     return labels;
    }catch(e){
        console.log(e);
    }
}
   module.exports.getLabels = getLabels;