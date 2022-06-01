# Key Features
1. Upload video assets from local files. √
2. Add multiple video assets to the sequence. √
3. Preview the video sequence. √
4. Pause playback of the preview while changing visibility of the window. √
5. Visulize Timeline panel for workplace √
6. Use React-Redux to communicate between components

# Packages Required
FFmpeg

# TODO
1. Export videos to local files 
3. Clip videos by frames
2. Visulize Timeline panel for workplace
4. Support audio playback
2. Specify the area used for workplace
3. Visulize video assets
4. Add a video sequencer to edit strips
5. Enable the function of showing videos frame by frame within the workplace


# CSCC
1. normalize/reset
2. naming - BEM
3. responsive design


# Logs

13/05/2022 - In terms of extracting image sequences from videos, consider the use of WebCodecs API instead of native methods such as `setTimeOut`.

17/05/2022 - Solve the problem that the video is loaded incompletedly while adding to sequence.

19/05/2022 - Load the asset with decoder and demuxer to speed up the reading of the frame. (The old version only allows for play speed as it projects frames in the offscreen canvas)
    - Use MP4Box to demuxe video assets from src: get related info and generate encoded video chunks
    - Use VideoDecoder from Webcodecs API to decode video chunks and get video frames


21/05/2022 - Implement the timeline for video editing.

23/05/2022 - Add React-DnD. 

01/06/2022 - Implement asset cards and enable the drag function.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:
