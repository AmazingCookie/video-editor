import Asset from "./Asset";

class VideoAsset extends Asset {

    constructor({ name, src } = {}) {
        super({ name, type: 'video', src });
        this.$videoElem = document.createElement('video');
        this.$videoElem.src = this.src;
        this.$videoElem.preload = 'auto';
        this.paused = true;
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

    getPosterSrc = async (startFrame) => {
        const $canvas = document.createElement('canvas');
        await this.render(startFrame, 'ONE_FRAME');

        $canvas.width = this.$videoElem.videoWidth;
        $canvas.height = this.$videoElem.videoHeight;
        $canvas.getContext('2d').drawImage(this.$videoElem, 0, 0, $canvas.width, $canvas.height);
        const src = $canvas.toDataURL();
        return src
    }

    render = async(startFrame, mode) => {
        this.paused = false;
        this.$videoElem.currentTime = startFrame / this.getFPS();
        console.log(`
            Given current time is: ${startFrame / this.getFPS()};
            Real time is: ${this.$videoElem.currentTime}
        `)

        // document.body.append(this.$videoElem);
        if (mode === 'FRAME_BY_FRAME') {
            this.$videoElem.muted = false;
            await this.$videoElem.play();
        }
        if (mode === 'ONE_FRAME') {
            this.paused = true;
            this.$videoElem.muted = true;
            await this.$videoElem.play();
            await this.$videoElem.pause();
        }

        console.log('Rendering.....');
        console.log('Start fream is: ' + startFrame);
        console.log('Mode is: ' + mode);
    }

    getCounter = () => {
        return this.count;
    }

    setPause = () => {
        this.paused = true;
        this.$videoElem.pause();
    }

    isPaused = () => {
        return this.paused;
    }

    watch = () => {
        return this.$videoElem;
    }


}

export default VideoAsset;