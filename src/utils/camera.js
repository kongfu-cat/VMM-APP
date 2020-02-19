export function getPicture () {
    return new Promise((resolve, reject) => {
        navigator.camera.getPicture(
            data => { // 如果成功
                // console.log(`data:image/jpeg;base64,${data}`)
                resolve(data)
            },
            (err) => { // 如果失败
                console.log('Could not access device camera, err: ', err)
                reject(err)
            },
            {
                // Some common settings are 20, 50, and 100
                quality: 10,
                // sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL,
                // In this app, dynamically set the picture source, Camera or photo gallery
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                saveToPhotoAlbum: true,
                targetWidth: 500,
                targetHeight: 500,
                // allowEdit: true,
                // correctOrientation: true  //Corrects Android orientation quirks
            }
        )
    })
}

export function getPictureFromLib () {
    return new Promise((resolve, reject) => {
        navigator.camera.getPicture(
            data => { // 如果成功
                // console.log(`data:image/jpeg;base64,${data}`)
                resolve(data)
            },
            (err) => { // 如果失败
                console.log('Could not access device camera, err: ', err)
                reject(err)
            },
            {
                // Some common settings are 20, 50, and 100
                quality: 10,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.DATA_URL,
                // In this app, dynamically set the picture source, Camera or photo gallery
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                saveToPhotoAlbum: true,
                targetWidth: 500,
                targetHeight: 500,
                // allowEdit: true,
                // correctOrientation: true  //Corrects Android orientation quirks
            }
        )
    })
}

export function getPictureConfirm () {
    return new Promise((resolve, reject) => {
        let onConfirm = (buttonIndex) => {
            switch (buttonIndex) {
                case 1: {
                    getPicture().then(data => {
                        resolve(data)
                    })
                } break;
                case 2: {
                    getPictureFromLib().then(data => {
                        resolve(data)
                    })
                } break;
                default: break;
            }
        }
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady () {
            navigator.notification.confirm(
                '请选择从哪里获取图片', // message
                onConfirm,            // callback to invoke with index of button pressed
                '图片',           // title
                ['拍照', '相册']     // buttonLabels
            );
        }
    })
}