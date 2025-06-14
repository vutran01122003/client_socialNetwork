export function checkImageUpload(file) {
    if (file?.type !== "image/jpeg" && file?.type !== "image/png" && file?.type !== "image/gif") {
        return {
            inValid: true,
            msg: "Image format is incorrect"
        };
    }

    if (file.size > 5 * 1024 * 1024) {
        return {
            inValid: true,
            msg: "The largest image size is 5MB"
        };
    }

    return {
        inValid: false,
        msg: "image format is correct"
    };
}

export function checkVideoUpload(file) {
    if (file.size > 50 * 1024 * 1024) {
        return {
            inValid: true,
            msg: "The largest video size is 50MB"
        };
    }

    return {
        inValid: false,
        msg: "video format is correct"
    };
}

export const uploadFile = async (files = []) => {
    const newVideos = [];
    const userfiles = [];
    files.forEach((file) => {
        if (file.url) newVideos.push(file);
        else {
            userfiles.push(file);
        }
    });

    for (let file of userfiles) {
        const formData = new FormData();

        formData.append("upload_preset", "oyptwxxs");
        if (file.imgCamera) {
            formData.append("file", file.imgCamera);
        } else if (file.video) {
            formData.append("file", file.video);
        } else {
            formData.append("file", file);
        }

        const res = await fetch("https://api.cloudinary.com/v1_1/dzm0nupxy/upload", {
            method: "POST",
            body: formData
        });

        const imgData = await res.json();

        newVideos.push({
            id: imgData.public_id,
            url: imgData.secure_url
        });
    }

    return newVideos;
};

export function loadURLToInputFiled(url, element) {
    getImgURL(url, (imgBlob) => {
        let fileName = "hasFilename.jpg";
        let file = new File([imgBlob], fileName, { type: "image/jpeg", lastModified: new Date().getTime() }, "utf-8");
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
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
}
