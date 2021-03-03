class VCAudio {
    constructor(stream) {
        this.context = new AudioContext()
        this.gainNode = this.context.createGain()
        this.analyser = this.context.createAnalyser()
        this.source = this.context.createMediaStreamSource(stream)
    }
    gain() {
        this.source.connect(this.gainNode)
        this.gainNode.connect(this.context.destination)
    }
    analyser(destination = false) {
        this.source.connect(this.analyser)
        if (destination) this.analyser.connect(this.context.destination)
    }
    getFrecuencyFromAnalyser() {
        const fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(fbcAarray);
        return fbcArray[0] / 100
    }
}
export default VCAudio