class VCAudio {
    constructor(stream) {
        this.context = new AudioContext()
        this.analyser = this.context.createAnalyser()
        this.source = this.context.createMediaStreamSource(stream)
    }
    createAnalyser() {
        this.source.connect(this.analyser)
    }
    getFrecuencyFromAnalyser() {
        const fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(fbcArray);
        return fbcArray[0] / 100
    }
}
export default VCAudio