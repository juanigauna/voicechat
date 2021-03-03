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
        startAudioBehavior(stream)
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
function audioBehavior(stream) {
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
function startAudioBehavior(stream) {
    const audio = audioBehavior(stream)
    connectSourceToAnalyser(audio.source, audio.analyser)
    myAudio.addEventListener('timeupdate', () => {
        let frecuency = audioAnalyser(audio.analyser)
        document.getElementById('frec').innerHTML = frecuency
        if (frecuency > .8) {
            myAudio.muted = false
            document.getElementById('audio-status').classList.add('talking')
        }
        if (frecuency < 0.8) {
            myAudio.muted = true
            if (document.getElementById('audio-status').classList.contains('talking')) {
                document.getElementById('audio-status').classList.remove('talking')
            }
        }
    })
}