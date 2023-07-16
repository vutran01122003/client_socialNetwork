export async function readFileAsDataURL(fileInput) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        if (fileInput !== null) {
            reader.readAsDataURL(fileInput);
        } else {
            resolve('');
        }
    });
}
