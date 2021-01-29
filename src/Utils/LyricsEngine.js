export function searchAndParse(track) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://www.megalobiz.com/lrc/maker/download-music-lyrics-lrc-generated-files?qry=${track.title} ${track.artist}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      return parse(result, track.formatedLength);
    })
    .catch((error) => console.log("error", error));
}
function parse(htmlString, trackLength) {
  console.log(htmlString);
  const lyricsObj = {};
  let regexString = `\\[${trackLength}].*\\"\\;`;
  const regex = new RegExp(regexString);
  let m;
  while ((m = regex.exec(htmlString)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const lyricStrings = m[0].replace(/\\n/gm, "__").split("__");
    lyricStrings.forEach((string) => {
      const strip = string.split("]");
      const lyricStrip = {
        timestamp: timeStrToNum(strip[0].replace("[", "")),
        text: strip[1].replace(/";/g, ""),
      };
      lyricsObj[`${lyricStrip.timestamp}`] = lyricStrip.text;
    });
  }
  delete lyricsObj[Object.keys(lyricsObj)[0]];
  console.log(lyricsObj);
  return lyricsObj;
}
function timeStrToNum(str) {
  const minute = Number(str.slice(0, 2));
  const second = Number(str.slice(3, 5));
  const minSec = Number(str.slice(6, 8));
  return minute * 60 + second + minSec / 100;
}
