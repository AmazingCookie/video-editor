import { configureStore} from '@reduxjs/toolkit';
import { assetReducer, clipReducer } from '../slices';


export const store = configureStore({
    reducer: {
        asset: assetReducer,
        clip: clipReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})