function requestPermissions() {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        })
            .then(mediaStream => resolve(mediaStream))
            .catch(error => reject(error))
    })
}
async function getUserMedia() {
    let media = await requestPermissions()
    return media
}

export default getUserMedia