import { createSlice } from "@reduxjs/toolkit";
import { Clip } from "../models";

const clipDefaultState = {
    clipList: [],
    audioClipList: [],
    nChannels: 1,
    nbSamples: 0,
    fps: 25
};


const clipSlice = createSlice({
    name: 'clips',
    initialState: clipDefaultState,
    reducers: {
        addClip: (state, { payload }) => {
            const { asset, startOffset, nbSamples, offset = state.nbSamples, channel = 0, posterSrc } = payload;

            state.clipList = [
                ...state.clipList,
                new Clip({
                    offset,
                    startOffset,
                    nbSamples,
                    asset,
                    channel,
                    posterSrc
                })
            ];

            state.nbSamples += nbSamples;
        },
        addClipAtIndex: (state, { payload }) => {
            const { asset, startOffset, nbSamples, offset, channel, posterSrc, index } = payload;

            state.clipList = [
                ...state.clipList,
                new Clip({
                    offset,
                    startOffset,
                    nbSamples,
                    asset,
                    channel,
                    posterSrc
                })
            ];

            state.nbSamples += nbSamples;
        },
        removeClip: (state, { payload }) => {
            const { id } = payload;
            const clipIndex = state.clipList.findIndex(clip => clip.id === id);
            console.log(clipIndex);

            if (clipIndex === -1)
                return;

            let newList = [...state.clipList];
            const length = newList[clipIndex].nbSamples;

            
            const later = newList.slice(clipIndex + 1).map((clip) => {
                const newClip = clip;
                newClip.offset -= length;
                return newClip;
            })

            state.clipList = [
                ...newList.slice(0, clipIndex),
                ...later
            ];

            state.nbSamples -= length;
        },
        splitClip: (state, { payload }) => {
            console.log('handle split');
            const { clipIndex, offset_second, nbSample_first,
                nbSample_second, startOffset_second, posterSrc_second } = payload;

            const clip = state.clipList[clipIndex];

            const newClip = new Clip({
                offset: offset_second,
                startOffset: startOffset_second,
                nbSamples: nbSample_second,
                asset: clip.asset,
                channel: clip.channel,
                posterSrc: posterSrc_second
            })

            console.log(`
                        nbSample_first: ${nbSample_first}, 
                        nbSample_second: ${nbSample_second}, 
                        startOffset_second: ${startOffset_second},
                        offset_second: ${offset_second}`)
            const newList = [...state.clipList];
            newList[clipIndex].nbSamples = nbSample_first;
            console.log(newList);
            console.log(newList.splice(clipIndex + 1, 0, newClip));
            state.clipList = newList;

        },
        swapClip: (state, { payload }) => {
            const { id_first, id_second } = payload;
            const clipIndex_first = state.clipList.findIndex(clip => clip.id === id_first);
            const clipIndex_second = state.clipList.findIndex(clip => clip.id === id_second);

            let newList = [...state.clipList];
            [newList[clipIndex_first], newList[clipIndex_second]]
                = [newList[clipIndex_second], newList[clipIndex_first]];

            let length = 0;
            newList = newList.map((clip) => {
                clip.offset = length;
                length += clip.nbSamples;
                return clip;
            })

            state.clipList = newList;
        },
        changeClipVolume: (state, { payload }) => {
            const { id, volume } = payload;
            const clip = state.clipList.find((clip) => clip.id === id);
            clip.volume = volume;
            console.log(`
                id: ${id},
                volume: ${volume}
            `)
            clip.asset.setVolume(volume);
        }
    }
})



export const { addClip, removeClip, splitClip, swapClip, addClipAtIndex, changeClipVolume } = clipSlice.actions;
export default clipSlice.reducer;

