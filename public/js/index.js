const socket = io()
const myPeer = new Peer('', PEER_CONFIG)

const peers = {}

const myAudio = document.createElement('audio')
myAudio.muted = true

navigator.mediaDevices.getUserMedia({
    audio: true
})
    .then(stream => {
        //addAudioStream(myAudio, stream)
        createAudioState(stream, 'me')
        myPeer.on('call', call => {
            console.log(call)
            call.answer(stream)
            const audio = document.createElement('audio')
            call.on('stream', userAudioStream => {
                //addAudioStream(audio, userAudioStream)
                createAudioState(stream, call.connectionId, true)
            })
            call.on('close', () => audio.remove())
        })
        socket.on('user-connected', data => {
            connectToNewUser(data.userId, stream)
            createAudioState(stream, data.userId, true)
        })
    })

myPeer.on('open', id => {
    socket.emit('join', { roomId: ROOM_ID, userId: id })
})
myPeer.on('error', error => {
    console.log(error)
    switch (error) {
        case 'network':
            return myPeer.reconnect()
        case 'server-error':
            return alert('An error ocurred with the server, please connect later.')
        default:
            return alert('Error undefined... We are in serious trouble ;)')
    }
})

socket.on('user-disconnected', data => {
    peers[data.userId] && peers[data.userId].close()
    document.getElementById(`audio-status-${data.userId}`).remove()
})
function createAudioState(stream, userId, destination = false) {
    const audioStatus = document.createElement('div')
    audioStatus.id = `audio-status-${userId}`
    audioStatus.className = `me`
    const icon = document.createElement('p')
    icon.id = `icon-${userId}`
    audioStatus.appendChild(icon)
    document.getElementById('client-list').appendChild(audioStatus)
    startAudioBehavior(stream, userId, destination)
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
        // addAudioStream(audio, userAudioStream)
        startAudioBehavior(userAudioStream, userId, true)
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
function connectAnalyserToContextDestination(analyser, destination) {
    analyser.connect(destination)
}
function audioAnalyser(analyser) {
    const fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    return fbc_array[0] / 100
}
function startAudioBehavior(stream, userId, destination) {
    const audio = audioContext(stream)
    connectSourceToAnalyser(audio.source, audio.analyser)
    if (destination) connectAnalyserToContextDestination(audio.analyser, audio.context.destination)
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