import { wait } from "@testing-library/user-event/dist/utils";

export class Decoder {
    constructor(ref) {
        this.decoder = null;
        this.index = 0;
        this.offset = 0;

        this.frame = null;
        this._frame_resolver = null;
        this.pendingFrames = [];
        this.maxPendings = 1000;

        this.$frames = ref;
    }

    configure = (info) => {
        // init decoder
        const init = {
            output: this.handleFrame,
            error: err => console.log(err)
        }
        this.decoder = new window.VideoDecoder(init);

        // For the description, please refer to
        // https://www.w3.org/TR/webcodecs-codec-registry/
        const config = {
            codec: info.codec,
            codedHeight: info.track_height,
            codedWidth: info.track_width,
            description: info.extradata
        }

        this.decoder.configure(config);
    }

    decode = (chunk) => {
        this.decoder.decode(chunk);
    }


    setRange = (start, nbSamples) => {
        this.nbSamples = nbSamples;
        this.start = start;
        this.count = 0;
    }

    handleFrame = (frame) => {
        const $canvas = document.createElement('canvas')
        $canvas.className = "video-scrubber-frame"
        $canvas.height = frame.codedHeight;
        $canvas.width = frame.codedWidth;

        $canvas.getContext('2d').drawImage(frame, 0, 0, frame.codedWidth, frame.codedHeight);

        this.$frames.appendChild($canvas);

        console.log('go');
        frame.close();
        this.index++;

        // if (this.index >= this.start &&
        //     this.count <= this.nbSamples) {
        //     this.pendingFrames.push(frame);
        //     this.count++;
        // }
        // else
        //     frame.close();

        // if (this.pendingFrames.length && this._frame_resolver) {
        //     this._frame_resolver(this.pendingFrames.shift());
        //     this._frame_resolver = null;
        // }
        // this.index++;
    }

    // getFrame = () => {
    //     // console.log('try to get frame!');
    //     if (this.pendingFrames.length > 0)
    //         return Promise.resolve(this.pendingFrames.shift());
    //     return new Promise((resolver) => { this._frame_resolver = resolver });
    // }

}
