import { v4 as uuidv4 } from "uuid";
import { Decoder } from "../Decoder";
import { Demuxer } from "../Demuxer";

class Asset {

    constructor({ name, type, src } = {}) {
        this.id = uuidv4(); // unique id
        this.name = name;   // the name of the src
        this.type = type;   // the type of asset
        this.src = src;     // url

        this.info = null;    // track information
        this.samples = null;
        this.getTrackInfo();

    }

    getTrackInfo = async () => {
        const demuxer = new Demuxer(this.src);
        const info = await demuxer.getInfo();

        if (this.type === 'video') {
            this.info = info.videoTracks[0];
            this.info.extradata = demuxer.getExtraData();
        }

        if (this.type === 'audio')
            this.info = info.audioTracks[0];

        demuxer.start(this.info.id);
        this.samples = await demuxer.getSamples();
        console.log(this.samples);
        demuxer.flush();
        
    }

    decode = (start) => {
        const decoder = new Decoder(start);
        decoder.configure(this.info);
        for (let sample of this.samples) {
            const type = sample.is_sync ? "key" : "delta";
            let chunk = new window.EncodedVideoChunk({
                type,
                data: sample.data,
                duration: sample.duration,
                timestamp: sample.cts
            })
            decoder.decode(chunk);
        }
    }



    // sourceOpen = async(event) => {
    //     const mediaSource = event.target;

    //     const demuxer = new Demuxer(this.src);
    //     await demuxer.init();

    //     console.log(mediaSource.readyState); // open

    //     const sourceBuffer = await new Promise((resolve, reject) => {
    //         const videoCodec = demuxer.getVideoInfo().codec;
    //         const audioCodec = demuxer.getAudioInfo().codec;
    //         let mimeCodec = `video/mp4; codecs="${videoCodec}"`;
    //         const getSourceBuffer = () => {
    //             try {
    //                 const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    //                 resolve(sourceBuffer);
    //             } catch (e) {
    //                 reject(e);
    //             }
    //         };

    //         if (mediaSource.readyState === 'open') {
    //             getSourceBuffer();
    //         } else {
    //             mediaSource.addEventListener('sourceopen', getSourceBuffer);
    //         }

    //     });


    //     

    //     mediaSource.onsourceclose = () => {
    //         console.log('end');
    //         this.$videoElem.play();
    //         demuxer.flush();
    //     }
    // }



    // test = () => {
    //     const encoder = new Encoder();
    //     encoder.configure(this.info);
    //     document.body.append(this.$videoElem);

    //     const mediaSource = new window.MediaSource();
    //     this.$videoElem.src = URL.createObjectURL(mediaSource);
    //     mediaSource.addEventListener('sourceopen', this.sourceOpen);
    // }



    //    encode = async(src) => {
    //         const decoder = new Encoder();
    //         decoder.configure(this.trackInfo);
    //         demuxer.start(decoder.decode, trackInfo.id);
    //     }


    // demuxe = async() => {
    //     const demuxer = new Demuxer(src);
    //     await demuxer.init();
    //     this.trackInfo = demuxer.getVideoInfo();
    // }

    setRange = ({ start, end } = {}) => {
        this.range = {}
        this.range.start = start;
        this.range.end = end;
    }

    getFrame = async (index) => {
        this.decoder = new Decoder();
        this.decoder.configure(this.info);

        const frame = await this.decoder.getFrame(index);
        return frame;
    }

    getNbSamples = () => {

    }

    loadCompletely = () => {
        this.loaded = true;
        this.isLoading = false;
        console.log(`
            Load completedly!
            Approximate frame length is:    ${Math.floor(this.fps * this.videoElem.duration)};
            Approximate FPS is:             ${this.fps};
            Real frame Length is:           ${this.frames.length};
            Real FPS is:                    ${Math.round(this.frames.length / this.videoElem.duration)};
        `);

        this.fps = Math.round(this.frames.length / this.videoElem.duration);
    }





};




export default Asset;