module.exports = artistSort = (artistArr => {
    console.log(artistArr.length + " artists");
    let smallestIndex = 0;
    let currentIndex = 1;
    let beginningIndex = 0;

    while(beginningIndex < artistArr.length) {
        while (currentIndex < artistArr.length) {
            if (artistArr[smallestIndex].popularity > artistArr[currentIndex].popularity) {
                smallestIndex = currentIndex;
            }
            currentIndex++;
        }
        if (smallestIndex !== beginningIndex) {
            swapArr(artistArr, smallestIndex, beginningIndex);
        }
        beginningIndex++;
        currentIndex = beginningIndex + 1;
        smallestIndex = beginningIndex;
    }
   
    let sortedArtistArr = artistArr.reverse();
    console.log("Top Artist: " + sortedArtistArr[0].name + " -- " + sortedArtistArr[0].popularity);
    return sortedArtistArr;
})

function swapArr (arr, indexOne, indexTwo) {
    let temp = arr[indexOne];
    arr[indexOne] = arr[indexTwo];
    arr[indexTwo] = temp;
}