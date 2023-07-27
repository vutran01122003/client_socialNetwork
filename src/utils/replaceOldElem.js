function replaceOldElem(arr, newItem) {
    const newArr = [...arr];
    for (let i = 0; i < newArr.length; i++) {
        if (newArr[i]._id === newItem._id) {
            newArr.splice(i, 1, newItem);
            break;
        }
    }
    return newArr;
}

export default replaceOldElem;
