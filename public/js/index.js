const socket = io()
const myPeer = new Peer('', PEER_CONFIG)

const peers = {}

const myAudio = document.createElement('audio')
myAudio.muted = true

navigator.mediaDevices.getUserMedia({
    audio: true
})
.then(stream => {
    addAudioStream(myAudio, stream)
    myPeer.on('call', call => {
        call.answer(stream)
        const audio = document.createElement('audio')
        call.on('stream', userAudioStream => {
            addAudioStream(audio, userAudioStream)
        })
        call.on('close', () => audio.remove())
    })
    socket.on('user-connected', data => connectToNewUser(data.userId, stream))
})

myPeer.on('open', id => {
    socket.emit('join', { roomId: ROOM_ID, userId: id })
})


socket.on('user-disconnected', data => peers[data.userId] && peers[data.userId].close())

function addAudioStream(audio, stream) {
    audio.srcObject = stream
    audio.addEventListener('loadedmetadata', () => {
        audio.play()
    })
    document.getElementById('audio-recipent').appendChild(audio)
}
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const audio = document.createElement('audio')
    call.on('stream', userVideoStream => {
        addAudioStream(audio, userVideoStream)
    })
    call.on('close', () => audio.remove())
    peers[userId] = call
}