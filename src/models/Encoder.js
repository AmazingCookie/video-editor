import { _throw } from "../components/Debug";

export class Encoder {

    encoder = null;
    data = null;

    $offScreenCanvas = document.createElement("canvas");
    ctx = this.$offScreenCanvas.getContext('2d');

    constructor(data) {
        // this.data = data;

        document.body.appendChild(this.$offScreenCanvas);
    }

    configure = async(info) => {
        const init = {
            output: this.handleChunk,
            error: err => console.log(err)
        };

        this.encoder = new window.VideoEncoder(init);

        console.log(info);

        const config = {
            codec: info.codec,
            width: info.track_width,
            height: info.track_height,
            bitrate: info.bitrate, 
            framerate: info.nb_samples / (info.duration / info.timescale)
        };

        console.log(config);
        this.encoder.configure(config);
    }

    encode = async (data, info) => {
        console.log('Here!!');
        const pixelSize = 4
        const init = {
            timestamp: 0,
            codedWidth: info.track_width,
            codedHeight: info.track_height,
            format: "RGBA",
        };
        console.log(data.byteLength);

        const chunkSize = init.codedWidth * init.codedHeight * pixelSize;
        for (let i = 0; i < data.length; i += chunkSize) {
            const frame = new window.VideoFrame(data.slice(i, i + chunkSize), init);
            const bitmap = await createImageBitmap(frame);
            this.$offScreenCanvas.width = bitmap.width;
            this.$offScreenCanvas.height = bitmap.height;
            this.ctx.drawImage(bitmap, 0, 0);
            console.log(i);
        }
    }

    handleChunk = () => {

    }


}