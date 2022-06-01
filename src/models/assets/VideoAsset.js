import Asset from "./Asset";

class VideoAsset extends Asset {

    $videoElem = document.createElement('video');

    constructor({ name, src } = {}) {
        super({ name, type: 'video', src });
        this.$offScreenCanvas = document.querySelector("canvas");
    }

    getNbSamples = () => {
        if (!this.info)
            throw new Error('Video asset is not loaded properly');

        return this.info.nb_samples;
    }

    getFPS = () => {
        if (!this.info)
            throw new Error('Video asset is not loaded properly');

        let fps = this.info.nb_samples / (this.info.duration / this.info.timescale);
        return fps;
    }

    getDuration = () => {
        if (!this.info)
            throw new Error('Video asset is not loaded properly');

        return this.info.duration / this.info.timescale;
    }

    render = async (startFrame, nbSamples) => {
        const $video = document.createElement("video");
        $video.src = this.src;
        $video.currentTime = startFrame / this.getFPS();
        document.body.append($video);

        const getVideoTrack = async () => {
            await $video.play();
            this.pause = false;
            const [track] = $video.captureStream().getVideoTracks();
            $video.onended = e => track.stop();
            return track;
        }

        this.count = 0;
        const track = await getVideoTrack();
        const processor = new window.MediaStreamTrackProcessor(track);
        const reader = processor.readable.getReader();
        this.$offScreenCanvas.height = this.info.track_height;
        this.$offScreenCanvas.width = this.info.track_width;
        const ctx = this.$offScreenCanvas.getContext('2d');
        
        const readChunk = () => {
            reader.read().then(async ({ done, value }) => {
                if (this.count >= nbSamples || this.pause) {
                    $video.pause();
                    return;
                }
                else if (value) {
                    const bitmap = await createImageBitmap(value);
                    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
                    this.count++;
                    value.close();
                }
                if (!done) {
                    readChunk();
                }
            });
        }

        readChunk();
    }

    getCounter = () => {
        return this.count;
    }

    setPause = () => {
        this.pause = true;
    }

    watch = () => {
        return this.$offScreenCanvas;
    }


}

export default VideoAsset;