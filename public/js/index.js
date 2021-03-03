const socket = io()
const myPeer = new Peer('', PEER_CONFIG)

const peers = {}

const myAudio = new Audio()
myAudio.muted = true

navigator.mediaDevices.getUserMedia({
    audio: true
})
    .then(stream => {
        addAudioStream(myAudio, stream)
        createAudioState(stream, 'me')
        myPeer.on('call', call => {
            console.log(call)
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

myPeer.on('open', id => {
    socket.emit('join', { roomId: ROOM_ID, userId: id })
})
myPeer.on('error', error => {
    socket.emit('error', error)
    socket.on('error', error => {
        const errorMessage = document.createElement('p')
        errorMessage.innerHTML = `ERROR!: ${error}`
        document.getElementById('error-logger').appendChild(error)
    })
})

socket.on('user-disconnected', data => {
    peers[data.userId] && peers[data.userId].close()
    document.getElementById(`audio-status-${data.userId}`).remove()
})
function createAudioState(stream, userId) {
    const audioStatus = document.createElement('div')
    audioStatus.id = `audio-status-${userId}`
    audioStatus.className = `me`
    const icon = document.createElement('p')
    icon.id = `icon-${userId}`
    audioStatus.appendChild(icon)
    document.getElementById('client-list').appendChild(audioStatus)
    startAudioBehavior(stream, userId)
}
function addAudioStream(audio, stream) {
    audio.srcObject = stream
    audio.addEventListener('loadedmetadata', () => {
        audio.play()
    })
}
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const audio = document.createElement('audio')
    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream)
        startAudioBehavior(userAudioStream, userId)
    })
    call.on('close', () => audio.remove())
    peers[userId] = call
}
function audioContext(stream) {
    const context = new AudioContext()
    const analyser = context.createAnalyser()
    const source = context.createMediaStreamSource(stream)
    return { context, analyser, source }
}
function connectSourceToAnalyser(source, analyser) {
    source.connect(analyser)
}
function audioAnalyser(analyser) {
    const fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    return fbc_array[0] / 100
}
function startAudioBehavior(stream, userId) {
    const audio = audioContext(stream)
    connectSourceToAnalyser(audio.source, audio.analyser)
    setInterval(() => {
        let frecuency = audioAnalyser(audio.analyser)
        if (frecuency > .8) {
            document.getElementById('audio-status-' + userId).classList.add('talking')
            document.getElementById('icon-' + userId).innerHTML = 'T'
        }
        if (frecuency < 0.8) {
            document.getElementById('icon-' + userId).innerHTML = 'M'
            if (document.getElementById('audio-status-' + userId).classList.contains('talking')) {
                document.getElementById('audio-status-' + userId).classList.remove('talking')
            }
        }
    }, 100)
}