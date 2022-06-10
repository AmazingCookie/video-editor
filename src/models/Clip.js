import { v4 as uuidv4 } from "uuid";

class Clip {
    constructor({ offset, startOffset, nbSamples, asset, channel, posterSrc} = {}) {
        this.id = uuidv4();
        this.channel = channel;
        this.offset = offset;   
        this.startOffset = startOffset;
        this.nbSamples = nbSamples;
        this.asset = asset;
        this.posterSrc = posterSrc;
        this.volume = 0.5;

        console.log(`Add clip: start is ${this.startOffset}, length is ${this.nbSamples}, offset is ${this.offset}`)
    }


    getPoster = async() => {
        const $canvas = document.createElement('canvas');

        await this.asset.render(this.startOffset, 'ONE_FRAME');
        const $video = this.asset.watch();

        $canvas.width = $video.videoWidth;
        $canvas.height = $video.videoHeight;

        $canvas.getContext('2d').drawImage($video, 0, 0, $canvas.width, $canvas.height);
        
        this.poster = new Image(100, 100);
        this.poster.src = $canvas.toDataURL();
    }

    // get the start frame of this clip
    getClipStart = () => {
        return this.offset + this.startOffset;
    }

    // get the end frame of this clip
    getClipEnd = () => {
        return this.offset + this.nbSamples;
    }

    // getSample = (index) => {
    //     return this.asset.samples[index];
    // }

    getInfo = () => {
        return this.asset.info;
    }
}

export default Clip;