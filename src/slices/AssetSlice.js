import { createSlice } from "@reduxjs/toolkit";
import { VideoAsset } from "../models";

const assetDefaultState = {
    assetList: [],
    filters: {

    }
};

const assetSlice = createSlice({
    name: 'assets',
    initialState: assetDefaultState,
    reducers: {
        addAsset: (state, { payload }) => {
            const {name, src, type = 'video'} = payload;

            if (type === 'video')
                state.assetList = [...state.assetList,
                    new VideoAsset({
                        name,
                        src
                    })
                ]
            
        },
        removeAsset: (state, { payload }) => {
            const { id, src } = payload;
            URL.revokeObjectURL(src);
            state.assetList = state.assetList.filter((asset) => asset.id !== id);
            console.log('asset list now: ');
            console.log(state.assetList);
        }
    }
})

export const { addAsset, removeAsset } = assetSlice.actions;
export default assetSlice.reducer;


// (state = assetDefaultState, action) => {
//     switch (action.type) {
//         case 'Add':
//             return {
//                 ...state,
//                 assetList: [
//                     ...state.assetList,
//                     new Asset({
//                         name: action.name,
//                         src: action.src
//                     })
//                 ]
//             }
//         case 'Delete':
//             return state;
//         default:
//             throw new Error(`Invalid action: {$action.type}`);
//     }
