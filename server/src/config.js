//CLOUD.MONGODB.COM DEVELOPMENT SETTINGS
// TIP: Create free online MongoDB Cluster at: https://cloud.mongodb.com/
const USERNAME = "ptaku19";
const PASSWORD = "a4bmSABL";
const HOST = "cluster0.fh8ux.mongodb.net";
const PORT = "27017";
const DB = "test";

module.exports = { USERNAME, PASSWORD, HOST, PORT, DB };

/*
package.json

"dependencies": {
    "cordova-android": "^8.1.0",
    "cordova-plugin-splashscreen": "^5.0.3",
    "cordova-plugin-statusbar": "^2.4.3"
  }
config.xml

    <preference name="Orientation" value="portrait" />
    <preference name="Fullscreen" value="true" />


    other solution *

    if (window.StatusBar){
window.StatusBar.show();
setTimeout(function(){
window.StatusBar.hide();
},5);
}

*/
