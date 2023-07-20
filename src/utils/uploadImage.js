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

export const uploadImage = (files = []) => {
    const newImages = [];
    files.forEach(async (file) => {
        const formData = new FormData();
        formData.append('upload_preset', 'oyptwxxs');
        formData.append('cloud_name', 'dzm0nupxy');
        formData.append('file', file);

        const res = await fetch(
            'https://api.cloudinary.com/v1_1/dzm0nupxy/upload',
            {
                method: 'POST',
                body: formData
            }
        );

        const imgData = await res.json();

        newImages.push({
            id: imgData.public_id,
            url: imgData.secure_url
        });
    });
    return newImages;
};

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
