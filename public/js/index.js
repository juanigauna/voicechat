import getUserMedia from './usermedia.js'

const socket = io()
const myPeer = new Peer('', PEER_CONFIG)

let me = {}
const peers = {}

const myAudio = new Audio()
myAudio.muted = true

document.getElementById('connect').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim()
    if (username.length > 0) {
        me = {...me, name: username }
        await init(username)
        socket.emit('join', { roomId: ROOM_ID, ...me })
        document.getElementById('choose-username').remove()
    }
})
function incomingCall(stream) {
    myPeer.on('call', call => {
        call.answer(stream)
        const audio = new Audio()
        call.on('stream', userAudioStream => {
            addAudioStream(audio, userAudioStream)
            socket.on('incoming-call', data => {
                if (data.toId === me.userId) createAudioState(data.userId, data.name)
                peers[data.userId] = call
            })
        })
        call.on('close', () => audio.remove())
    })
}
function onUserConnected(stream) {
    socket.on('user-connected', data => {
        outgoingCall(data.userId, stream)
        createAudioState(data.userId, data.name)
    })
}
async function init(name) {
    const stream = await getUserMedia()
    addAudioStream(myAudio, stream)
    createAudioState('me', name)
    incomingCall(stream)
    onUserConnected(stream)
}

myPeer.on('open', id => me = {...me, userId: id })

socket.on('user-disconnected', data => {
    if (peers[data.userId]) {
        console.log(data.userId)
        document.getElementById(`audio-status-${data.userId}`).remove()
        peers[data.userId].close()
    }
})
function createAudioState(userId, name) {
    const audioStatus = document.createElement('div')
    audioStatus.id = `audio-status-${userId}`
    audioStatus.className = `me`
    const icon = document.createElement('p')
    icon.id = `icon-${userId}`
    icon.innerHTML = name
    audioStatus.appendChild(icon)
    document.getElementById('client-list').appendChild(audioStatus)
}
function addAudioStream(audio, stream) {
    audio.srcObject = stream
    audio.addEventListener('loadedmetadata', () => audio.play())
}
function outgoingCall(userId, stream) {
    const call = myPeer.call(userId, stream)
    const audio = new Audio()
    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream)
        socket.emit('outgoing-call', { ...me, ...{ toId: userId } })
    })
    call.on('close', () => audio.remove())
    peers[userId] = call
}