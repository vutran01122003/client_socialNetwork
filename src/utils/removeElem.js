function removeElem(arr, id) {
    const newArr = [...arr];
    for (let i = 0; i < newArr.length; i++) {
        if (newArr[i]._id === id || newArr[i].userId === id) {
            newArr.splice(i, 1);
            break;
        }
    }
    return newArr;
}

export default removeElem;
