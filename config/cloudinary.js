const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const connectToCloudinary = () =>{

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dfwdgmhbp', 
        api_key: '225773124528416', 
        api_secret: 'GzkeMZ0ynDanYZKRjBo-uHDeD2M' 
    });
    console.log("Connected to Cloudinary");
    return cloudinary;
};

module.exports = connectToCloudinary; 
   