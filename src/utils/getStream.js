function getStream({ audio, video }) {
    return navigator.mediaDevices.getUserMedia({
        audio,
        video
    });
}

export default getStream;
