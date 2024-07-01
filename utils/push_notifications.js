const admin = require('../config/firebaseAdminConfig'); // Firebase Admin SDK initialization
// const apnProvider = require('../config/apnConfig'); // APNs configuration

// Function to send push notification to Android devices via FCM
async function sendAndroidNotification(deviceToken, title, body) {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: deviceToken,
        android: {
            notification: {
                sound: 'default' // Sound configuration for Android
            }
        }
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent Android notification:', response);
    } catch (error) {
        console.error('Error sending Android notification:', error);
    }
}

// Function to send push notification to iOS devices via APNs
async function sendiOSNotification(deviceToken, title, body) {
    // const notification = new apn.Notification({
    //     alert: {
    //         title: title,
    //         body: body,
    //     },
    //     sound: 'default', // Sound configuration for iOS
    // });

    // try {
    //     const response = await apnProvider.send(notification, deviceToken);
    //     console.log('Successfully sent iOS notification:', response);
    // } catch (error) {
    //     console.error('Error sending iOS notification:', error);
    // }
}

module.exports = {
    sendAndroidNotification,
    sendiOSNotification,
};
