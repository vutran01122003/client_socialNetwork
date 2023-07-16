export function checkImageUpload(file) {
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

export function loadURLToInputFiled(url, element) {
    getImgURL(url, (imgBlob) => {
        let fileName = 'hasFilename.jpg';
        let file = new File(
            [imgBlob],
            fileName,
            { type: 'image/jpeg', lastModified: new Date().getTime() },
            'utf-8'
        );
        let container = new DataTransfer();
        container.items.add(file);
        element.files = container.files;
    });
}

export function getImgURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
