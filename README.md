# Functions
Asset Management:
1.	Add video assets:
a)	Restriction: Video assets are not allowed to have same names
2.	Remove video assets:
a)	Click at the cross bottom directly in each asset card.

Clip Management:
3.	Add clips:
a)	Drag the asset card into the timeline or click at the plus button in the asset card
b)	Assets will be appended to the end of the clip list automatically
c)	The first frame of the clip will be considered as the poster of the clip card
4.	Swap clips:
a)	Drag the clip card directly to where it is supposed to be
b)	Clips will be rearranged automatically in terms of their offsets and length
5.	Delete clips:
a)	Click at the cross bottom directly in each clip card.
b)	Remained clips will fulfill the gap automatically
6.	Split clips:
a)	Move the pointer to the break point, and click at the split tool at the top of the timeline
b)	The clip will be separated into two automatically while the others remained the same.

Timeline:
1.	Zoom:
a)	Adjust the interval of the timeline by switching values of the slider
2.	Jump:
a)	Jump to the specified time point by clicking at the timeline directly.
b)	The pointer will be updated automatically based on the selected time point.
c)	The start of the playback will be set based on the pointer.
3.	Playback: 
a)	The pointer will move based on the current timestamp.

Preview:
1.	Render one frame:
a)	While the clip is paused, only a single frame will be rendered each time.
2.	Render frame by frame:
a)	While the clip starts playing, every frame will be rendered until it reaches the end or paused.

---

# Technical Aspects
1.	Use React-Redux to support the access of asset and clip lists.
2.	Use React-Router to support the switch between home page, clipping page and asset inspecting page.
3.	Use React Hooks to substitute all class components with functional components.
4.	Enhance the performance of the video editor by:
a)	Attaching Throttling to clickable buttons to avoid sending repeated requests within a specified time interval.



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

