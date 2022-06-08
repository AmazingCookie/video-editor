import { wait } from '@testing-library/user-event/dist/utils';
import MP4Box from 'mp4box';

export class Demuxer {

    constructor(src) {
        this.mp4boxfile = MP4Box.createFile();
        this.mp4boxfile.onMoovStart = this.onMoovStart;
        this.mp4boxfile.onReady = this.onReady;
        this.mp4boxfile.onErrror = this.onErrror;
        this.mp4boxfile.onSamples = this.onSamples;

        fetch(src).then((res) => res.arrayBuffer())
            .then((buf) => {
                buf.fileStart = 0;
                this.mp4boxfile.appendBuffer(buf);
            });

        this.info = null;
        this._info_resolver = null;

        this.samples = null;
        this._sample_resolver = null;
    }

    // startSegment = (user, id, nbSamples) => {
    //     if (!this.isReady)
    //         throw new Error('Demuxer is not ready!');

    //     this.mp4boxfile.setSegmentOptions(id, user, { nbSamples });
    //     const [initSeg] = this.mp4boxfile.initializeSegmentation();
    //     this.mp4boxfile.start();
    // }

    start = (id) => {
        const nbSamples = this.info.videoTracks[0].nb_samples;
        this.mp4boxfile.setExtractionOptions(id, null, { nbSamples });
        this.mp4boxfile.start();
    }

    onMoovStart = () => {
        console.log('Start to demux file');
    }

    onReady = (info) => {
        this.info = info;

        if (this._info_resolver) {
            this._info_resolver(info);
            this._info_resolver = null;
        }
    }

    onErrror = (err) => {
        console.log(`Fail to demuxe file due to ${err}`);
    }

    onSamples = (id, user, samples) => {
        this.samples = samples;

        if (this._sample_resolver) {
            this._sample_resolver(samples);
            this._sample_resolver = null;
        }

        // for (let sample of samples) {
        //     const type = sample.is_sync ? "key" : "delta";

        //     let chunk = new window.EncodedVideoChunk({
        //         type,
        //         data: sample.data,
        //         duration: sample.duration,
        //         timestamp: sample.cts
        //     })
        //     this._decode(chunk);
        // }
    }

    getSamples = () => {
        if (this.samples)
            return Promise.resolve(this.samples);
        return new Promise((resolver) => { this._sample_resolver = resolver; })
        // for (let sample of this.samples) {
        //     console.log('start!');
        //     const type = sample.is_sync ? "key" : "delta";

        //     let chunk = new window.EncodedVideoChunk({
        //         type,
        //         data: sample.data,
        //         duration: sample.duration,
        //         timestamp: sample.cts
        //     })
        //     decoder.decode(chunk);
        // }
    
    }

    // onSegment = async (id, user, buffer, sampleNum, last) => {
    //     console.log("Received" + (last ? " last" : "") + " segment on track " + id + " with sample up to " + sampleNum);
    //     // while (user.updating) {
    //     //   await wait(100);  
    //     // }
    //     // if (last) {
    //     //     console.log("Received" + (last ? " last" : "") + " segment on track " + id + " with sample up to " + sampleNum);
    //     //     const mediaSource = new window.MediaSource();
    //     //     const $videoElem = document.createElement('video');
    //     //     $videoElem.controls = true;
    //     //     $videoElem.autoplay = false;
    //     //     $videoElem.muted = true;

    //     //     document.body.append(this.$videoElem);
    //     //     $videoElem.src = URL.createObjectURL(mediaSource);
    //     //     mediaSource.onsourceopen = async (e) => {
    //     //         const mediaSource = e.target;

    //     //         mediaSource.addSourceBuffer(`video/mp4; codecs="${this.getVideoInfo().codec}"`);
    //     //         const sourceBuffer = await new Promise((resolve, reject) => {
    //     //             const videoCodec = this.getVideoInfo().codec;
    //     //             const audioCodec = this.getAudioInfo().codec;
    //     //             let mimeCodec = `video/mp4; codecs="${videoCodec}"`;

    //     //             const getSourceBuffer = () => {
    //     //                 try {
    //     //                     const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    //     //                     resolve(sourceBuffer);
    //     //                 } catch (e) {
    //     //                     reject(e);
    //     //                 }
    //     //             };

    //     //             if (mediaSource.readyState === 'open') {
    //     //                 getSourceBuffer();
    //     //             } else {
    //     //                 mediaSource.addEventListener('sourceopen', getSourceBuffer);
    //     //             }

    //     //         });
    //     //         console.log(sourceBuffer.buffered)
    //     //         sourceBuffer.appendBuffer(buffer);

    //     //         while (sourceBuffer.updating) {
    //     //             console.log(sourceBuffer.buffered);
    //     //             await wait(0);
    //     //         }
    //     //         console.log(sourceBuffer)
    //     //     }

    //     //     mediaSource.onaddsourcebuffer = () => {
    //     //         console.log('I\'m adding!');
    //     //     }

    //     //     mediaSource.onsourceclose = () => {
    //     //         console.log('close now');
    //     //         console.log(mediaSource.sourceBuffers);
    //     //         console.log($videoElem.src)
    //     //         $videoElem.play();
    //     //     }
    // // }

    // }

    flush = () => {
        this.mp4boxfile.flush();
    }

    getAudioInfo = () => {
        if (this.info) {
            const [trackInfo] = this.info.audioTracks;
            return Promise.resolve(trackInfo);
        }

        return new Promise((resolver) => { this._info_resolver = resolver});
    }

    getInfo = () => {
        if (this.info) 
            return Promise.resolve(this.info);

        return new Promise((resolver) => { this._info_resolver = resolver });
    }

    // Generate AVCDecoderConfigurationRecord for AVC format
    // Author: Thomas Guilbert from Google
    getExtraData = (index = 0) => {
        if (!this.info.tracks[index]?.video)
            throw new Error('The track index is incorrect.');

        console.log('Get extra data');

        const avccBox = this.mp4boxfile.moov.traks[index].mdia.minf.stbl.stsd.entries[0].avcC;

        let i;
        let size = 7;
        for (i = 0; i < avccBox.SPS.length; i++) size += 2 + avccBox.SPS[i].length;
        for (i = 0; i < avccBox.PPS.length; i++) size += 2 + avccBox.PPS[i].length;

        let id = 0;
        const data = new Uint8Array(size);

        const writeUint8 = (value) => {
            data.set([value], id);
            id++;
        };
        const writeUint16 = (value) => {
            const arr = new Uint8Array(1);
            arr[0] = value;
            const buffer = new Uint8Array(arr.buffer);
            data.set([buffer[1], buffer[0]], id);
            id += 2;
        };
        const writeUint8Array = (value) => {
            data.set(value, id);
            id += value.length;
        };

        writeUint8(avccBox.configurationVersion);
        writeUint8(avccBox.AVCProfileIndication);
        writeUint8(avccBox.profile_compatibility);
        writeUint8(avccBox.AVCLevelIndication);
        writeUint8(avccBox.lengthSizeMinusOne + (63 << 2));
        writeUint8(avccBox.nb_SPS_nalus + (7 << 5));

        for (i = 0; i < avccBox.SPS.length; i++) {
            writeUint16(avccBox.SPS[i].length);
            writeUint8Array(avccBox.SPS[i].nalu);
        }

        writeUint8(avccBox.nb_PPS_nalus);
        for (i = 0; i < avccBox.PPS.length; i++) {
            writeUint16(avccBox.PPS[i].length);
            writeUint8Array(avccBox.PPS[i].nalu);
        }

        if (id !== size) throw new Error('size mismatched !');
        return data;
    }

}

