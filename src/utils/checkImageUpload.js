function checkImageUpload(file) {
    if (
        file?.type !== 'image/jpeg' &&
        file?.type !== 'image/png' &&
        file?.type !== 'image/gif'
    ) {
        return {
            inValid: true,
            msg: 'Image format is incorrect'
        };
    }

    if (file.size > 1024 * 1024) {
        return {
            inValid: true,
            msg: 'The largest image size is 1MB'
        };
    }

    return {
        inValid: false,
        msg: 'image format is correct'
    };
}

export default checkImageUpload;
