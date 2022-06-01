import { createSlice } from "@reduxjs/toolkit";
import { Clip } from "../models";

const clipDefaultState = {
    clipList: [],
    audioClipList: [],
    current: 0,
    nChannels: 1,
    nbSamples: 0,
    fps: 25
};

const clipSlice = createSlice({
    name: 'clips',
    initialState: clipDefaultState,
    reducers: {
        addClip: (state, { payload }) => {
            const { asset, startOffset, nbSamples, offset = state.current, channel = 0 } = payload;

            state.clipList = [
                ...state.clipList,
                new Clip({
                    offset,
                    startOffset,
                    nbSamples,
                    asset,
                    channel
                })
            ];

            state.nbSamples += nbSamples;
        },
        addVideoClip: (state, { payload }) => {
            const { asset, startOffset, nbSamples, offset, channel = 0 } = payload;

            state.clipList = [
                ...state.clipList,
                new Clip({
                    offset,
                    startOffset,
                    nbSamples,
                    asset,
                    channel
                })
            ];

            state.nbSamples += nbSamples;
        },
        setClipCurrent: (state, { payload }) => {
            const { current } = payload;
            state.current = current;
        },
        remove: (state, { payload }) => {

        },
    }
})



export const { addClip, setClipCurrent } = clipSlice.actions;
export default clipSlice.reducer;

