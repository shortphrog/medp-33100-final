const cloudinary = require('cloudinary').v2;


async function connectToCloudnary() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dfwdgmhbp', 
        api_key: '225773124528416', 
        api_secret: 'GzkeMZ0ynDanYZKRjBo-uHDeD2M' 
    });
    

    return cloudinary; 
}

module.exports = connectToCloudnary; 
   