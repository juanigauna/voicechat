import getUserMedia from './usermedia.js'

const socket = io()
const myPeer = new Peer('', PEER_CONFIG)

const peers = {}

const myAudio = document.createElement('audio')
myAudio.muted = true

function incomingCall(stream) {
    myPeer.on('call', call => {
        call.answer(stream)
        const audio = document.createElement('audio')
        call.on('stream', userAudioStream => {
            addAudioStream(audio, userAudioStream)
            createAudioState(stream, call.connectionId)
        })
        call.on('close', () => audio.remove())
    })
}
function onUserConnected(stream) {
    socket.on('user-connected', data => {
        outgoingCall(data.userId, stream)
        createAudioState(stream, data.userId)
    })
}
async function init() {
    const stream = await getUserMedia()
    addAudioStream(myAudio, stream)
    createAudioState(stream, 'me')
    incomingCall(stream)
    onUserConnected(stream)
}

myPeer.on('open', async id => {
    await init()
    socket.emit('join', { roomId: ROOM_ID, userId: id })
})


socket.on('user-disconnected', data => {
    if (peers[data.userId]) {
        document.getElementById(`audio-status-${data.userId}`).remove()
        peers[data.userId].close()
    }
})
function createAudioState(stream, userId) {
    const audioStatus = document.createElement('div')
    audioStatus.id = `audio-status-${userId}`
    audioStatus.className = `me`
    const icon = document.createElement('p')
    icon.id = `icon-${userId}`
    icon.innerHTML = 'M'
    audioStatus.appendChild(icon)
    document.getElementById('client-list').appendChild(audioStatus)
}
function addAudioStream(audio, stream, userId = 'me') {
    audio.srcObject = stream
    audio.addEventListener('loadedmetadata', () => {
        audio.play()
    })
    document.getElementById('audio-recipent').appendChild(audio)
}
function outgoingCall(userId, stream) {
    const call = myPeer.call(userId, stream)
    const audio = document.createElement('audio')
    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream, userId)
    })
    call.on('close', () => audio.remove())
    peers[userId] = call
}