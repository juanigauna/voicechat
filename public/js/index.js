import VCAudio from './vcaudio.js'

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
        createAudioState(stream, 'me')
        myPeer.on('call', call => {
            call.answer(stream)
            const audio = new Audio()
            call.on('stream', userAudioStream => {
                addAudioStream(audio, userAudioStream)
                createAudioState(stream, call.connectionId)
            })
            call.on('close', () => audio.remove())
        })
        socket.on('user-connected', data => {
            connectToNewUser(data.userId, stream)
            createAudioState(stream, data.userId)
        })
    })

myPeer.on('open', id => socket.emit('join', { roomId: ROOM_ID, userId: id }))
myPeer.on('error', error => {
    socket.emit('error', error)
    socket.on('error', error => console.log('ERROR!', error))
})

socket.on('user-disconnected', data => {
    if (peers[data.userId]) {
        peers[data.userId].close()
        document.getElementById(`audio-status-${data.userId}`).remove()
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
    audioBehavior(stream, userId)
}
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
    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream)
        audioBehavior(userAudioStream, userId)
    })
    call.on('close', () => audio.remove())
    peers[userId] = call
}
function audioBehavior(stream, userId) {
    const context = new VCAudio(stream)
    context.createAnalyser()
    setInterval(() => {
        let frecuency = context.getFrecuencyFromAnalyser()
        if (frecuency >= .5) {
            document.getElementById('audio-status-' + userId).classList.add('talking')
            document.getElementById('icon-' + userId).innerHTML = 'T'
        } else {
            document.getElementById('icon-' + userId).innerHTML = 'M'
            if (document.getElementById('audio-status-' + userId).classList.contains('talking')) {
                document.getElementById('audio-status-' + userId).classList.remove('talking')
            }
        }
    }, 100)
}