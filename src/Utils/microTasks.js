var requestOptions = {
  method: "GET",
  redirect: "follow",
};
export async function getArtistPhotos(artistNames) {
  let pictures = [];
  const savedPicData = JSON.parse(localStorage.getItem("artistPictures"));
  let artistsWithsavedPics;
  if (savedPicData) {
    artistsWithsavedPics = savedPicData.map((picOj) => picOj.artist);
  }
  for (const artist of artistNames) {
    if (!artistsWithsavedPics.includes(artist)) {
      await fetch(
        `https://apiflbdeezer.herokuapp.com/search/?category=artists&query=${artist}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          if (JSON.parse(result).results && JSON.parse(result).results[0]) {
            const pic = JSON.parse(result).results[0].picture;
            pictures.push({ picture: pic, artist });
          }
        })
        .catch((error) => console.log("error", error));
    }
  }
  pictures = [...pictures, ...savedPicData];
  console.log(pictures);
  localStorage.setItem("artistPictures", JSON.stringify(pictures));
  return pictures;
}
