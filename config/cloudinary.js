const cloudinary = require('cloudinary').v2;


async function connectToCloudinary() {
    // Configuration
    cloudinary.config({
        cloud_name: 'dfwdgmhbp',
        api_key: '225773124528416',
        api_secret: 'GzkeMZ0ynDanYZKRjBo-uHDeD2M' // Click 'View API Keys' above to copy your API secret
    });

    return cloudinary;
}



module.exports = connectToCloudinary;
