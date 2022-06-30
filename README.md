# Functions
## Asset Management:
1.	Add video assets:
    - Restriction: Video assets are not allowed to have same names
2.	Remove video assets:
    - Click at the cross bottom directly in each asset card.

## Clip Management:
1.	Add clips:
    - Drag the asset card into the timeline or click at the plus button in the asset card
    - Assets will be appended to the end of the clip list automatically
    - The first frame of the clip will be considered as the poster of the clip card
2.	Swap clips:	
    - Drag and drop the clip card directly to where it is supposed to be
    - Clips will be rearranged automatically in terms of their offsets and length
3.	Delete clips:
    - Click at the cross bottom directly in each clip card.
    - Remained clips will fulfill the gap automatically
4.	Split clips:
    - Move the pointer to the break point, and click at the split tool at the top of the timeline
    - The clip will be separated into two automatically while the others remained the same.

## Timeline:
1.	Zoom:
    - Adjust the interval of the timeline by switching values of the slider
2.	Jump:
    - Jump to the specified time point by clicking at the timeline directly.
    - The pointer will be updated automatically based on the selected time point.
    - The start of the playback will be set based on the pointer.
3.	Playback: 
    - The pointer will move based on the current timestamp.

## Preview:
1.	Render one frame:
    - While the clip is paused, only a single frame will be rendered each time.
2.	Render frame by frame:
    - While the clip starts playing, every frame will be rendered until it reaches the end or paused.


# Technical Aspects
1.	Use React-Redux to support the access of asset and clip lists.
2.	Use React-Router to support the switch between home page, clipping page and asset inspecting page.
3.	Use React Hooks to substitute all class components with functional components.
4.	Enhance the performance of the video editor by:
    - Attaching Throttling to clickable buttons to avoid sending repeated requests within a specified time interval.


# CSCC
1. normalize/reset
2. naming - BEM
3. responsive design


# Logs


17/05/2022 - Solve the problem that the video is loaded incompletedly while adding to sequence.

19/05/2022 - Load the asset with decoder and demuxer to speed up the reading of the frame. (The old version only allows for play speed as it projects frames in the offscreen canvas)
    - Use MP4Box to demuxe video assets from src: get related info and generate encoded video chunks
    - Use VideoDecoder from Webcodecs API to decode video chunks and get video frames


21/05/2022 - Implement the timeline for video editing.

23/05/2022 - Add React-DnD and support drag and drop of clip and asset cards. 

01/06/2022 - Implement asset cards and enable the drag function.

...

