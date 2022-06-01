import { v4 as uuidv4 } from "uuid";

class Clip {
    constructor({ offset, startOffset, nbSamples, asset, channel} = {}) {
        this.id = uuidv4();
        this.channel = channel;
        this.offset = offset;   
        this.startOffset = startOffset;
        this.nbSamples = nbSamples;
        this.asset = asset;

        console.log(`Add clip: start is ${this.startOffset}, length is ${this.nbSamples}, offset is ${this.offset}`)
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