"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  dialog,
  ipcMain,
  globalShortcut,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const mm = require("music-metadata");
const NodeID3 = require("node-id3");
const isDevelopment = process.env.NODE_ENV !== "production";
const FS = require("fs");
const PATH = require("path");
const MUSICFOLDER = require("path").join(require("os").homedir(), "Music");
const APPDATAFOLDER = app.getPath("userData");
const ffmpeg = require("fluent-ffmpeg");
const { DownloaderHelper } = require("node-downloader-helper");
const ffbinaries = require("ffbinaries");
const ffmpegPath = PATH.join(APPDATAFOLDER, "ffmpeg");
const ffprobePath = PATH.join(APPDATAFOLDER, "ffprobe");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const CONVERTEDFILESDIR = PATH.join(MUSICFOLDER, "Converted");
const MERGEDFILESDIR = PATH.join(MUSICFOLDER, "Merged");

if (!FS.existsSync(CONVERTEDFILESDIR)) {
  FS.mkdirSync(CONVERTEDFILESDIR);
}
if (!FS.existsSync(MERGEDFILESDIR)) {
  FS.mkdirSync(MERGEDFILESDIR);
}

let FILESINARGS;

const defaultThumbnail = PATH.join(__static, "Thumbnail.png");

if (process.argv[1]) {
  FILESINARGS = process.argv[1];
}
app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
    },
    autoHideMenuBar: true,
    title: "FLB Music",
    icon: PATH.join(__static, "icon.png"),
  });
  win.maximize();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for application s and their menu bar
  // to stay active until the user  quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  createWindow();
  // globalShortcut.register("Control+Shift+I", () => false);
  win.webContents.on("new-window", function(e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

async function getCoverArtUrl(coverArt) {
  /*
  @param coverArt
  data URI from parse audio file
  defualt Thumbnail.png
  link from google images
  */
  const stringForm = JSON.stringify(coverArt);
  //Checks if is from  google images
  if (stringForm.includes("https:")) {
    let downloadedCover;
    await new Promise((resolve) => {
      const dl = new DownloaderHelper(coverArt, APPDATAFOLDER);
      dl.start();
      sendMsgToFrontend("successMsg", "Downloading Image...");
      dl.on("end", () => {
        sendMsgToFrontend(
          "successMsg",
          "Cover Art Image Downloade. Writing tags..."
        );
        resolve((downloadedCover = dl.getDownloadPath()));
      });
      dl.on("error", () =>
        sendMsgToFrontend("errorMsg", "Error in downloding the cover")
      );
    });
    return downloadedCover;
  }

  //Checks if it uses the default coverArt
  if (stringForm.includes("Thumbnail.png")) return defaultThumbnail;

  //Checks if cover art is imported
  if (stringForm.includes("file://"))
    return importedCoverArt.replace("file://", "");
}

ipcMain.on("updateTrackInfo", async (e, data) => {
  if (data.tags.cover) {
    data.tags.APIC = data.tags.cover;
  }
  if (data.tags.APIC) {
    data.tags.APIC = await getCoverArtUrl(data.tags.APIC);
  }
  let currentFilePath = data.path;
  let success = NodeID3.update(data.tags, currentFilePath);
  console.log("Tag write is " + success);
  if (success) {
    sendMsgToFrontend("successMsg", "Tags successfuly changed");
    win.webContents.send("removePlayingTrack");
    if (data.tags.title) {
      const folder = currentFilePath.match(/(.*)[\/\\]/)[1] || "";
      const mimeType = `.${currentFilePath.split(".").pop()}`;
      const newFileName = data.tags.title + mimeType;
      let newFilePath = PATH.join(folder, newFileName);
      console.log(newFilePath);
      FS.rename(data.path, newFilePath, () => console.log("rename successful"));
      setTimeout(() => {
        parseAudioFile(newFilePath, "audioWithCover", false);
        setTimeout(() => {
          win.webContents.send("playFirstTrack");
        }, 500);
      }, 1000);
      sendMsgToFrontend(`successMsg","File Renamed to ${newFileName}`);
    } else {
      setTimeout(() => {
        parseAudioFile(currentFilePath, "audioWithCover", false);
        setTimeout(() => {
          win.webContents.send("playFirstTrack");
        }, 500);
      }, 1000);
    }
  } else {
    sendMsgToFrontend("errorMsg", "Error occured in changing the tags");
  }
});
let importedVideo;
ipcMain.on("importVideoForConversion", async () => {
  let file = dialog.showOpenDialog({
    title: "Select Video",
    filters: [
      {
        name: "Video (.mp4, .m4v, .webm, .mkv)",
        extensions: ["mp4", "m4v", "webm", "mkv"],
      },
    ],
    properties: ["openFile"],
  });
  if (file) {
    for (let possibleVideo of (await file).filePaths) {
      if (
        possibleVideo.includes(".mp4") ||
        possibleVideo.includes(".m4v") ||
        possibleVideo.includes(".webm") ||
        possibleVideo.includes(".mkv")
      ) {
        importedVideo = possibleVideo;
        win.webContents.send("importedVideo", importedVideo);
      }
    }
  } else {
    return;
  }
});
let importedCoverArt;
ipcMain.on("importCoverArt", async () => {
  let file = dialog.showOpenDialog({
    title: "Select Video",
    filters: [
      {
        name: "Picture (.jpg, .png, .jpeg)",
        extensions: ["jpg", "png", "jpeg"],
      },
    ],
    properties: ["openFile"],
  });
  if (file) {
    for (let possibleCover of (await file).filePaths) {
      if (
        possibleCover.includes(".jpeg") ||
        possibleCover.includes(".jpg") ||
        possibleCover.includes(".png")
      ) {
        importedCoverArt = "file://" + possibleCover;
        win.webContents.send("importedCoverArt", importedCoverArt);
      }
    }
  } else {
    return;
  }
});
ipcMain.on("startConversionToMp3", (e) => {
  const newFileName =
    importedVideo.replace(/(.*)[\/\\]/, "").split(".")[0] + ".mp3";
  convertToMp3(importedVideo, PATH.join(MUSICFOLDER, newFileName, "mp3"));
});
ipcMain.on("addMusicFromFile", async () => {
  let files = dialog.showOpenDialog({
    title: "Add music",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg, .m4a)",
        extensions: ["mp3", "m4a", "ogg", "wav"],
      },
    ],
    properties: ["multiSelections", "openFile"],
  });

  if (!files) return;
  for (let fileOrFolder of (await files).filePaths) {
    if (
      fileOrFolder.includes(".mp3") ||
      fileOrFolder.includes(".m4a") ||
      fileOrFolder.includes(".ogg") ||
      fileOrFolder.includes(".wav")
    ) {
      console.log("Is a file");
      console.log(fileOrFolder);
      const pathToFile = fileOrFolder;
      const fileName = pathToFile.replace(/(.*)[\/\\]/, "");
      parseAudioFile(pathToFile, "audioWithCover", false);
    } else {
      FS.readdir(fileOrFolder, (err, files) => {
        if (err) return;
        files.forEach(async (fileName) => {
          if (
            fileName.includes(".mp3") ||
            fileName.includes(".m4a") ||
            fileName.includes(".ogg") ||
            fileName.includes(".wav")
          ) {
            const pathToFile = PATH.join(fileOrFolder, fileName);
            parseAudioFile(pathToFile, "audioWithCover", false);
          }
        });
      });
      console.log("IS a folder");
    }
  }
});
ipcMain.on("addMusicFromFolder", async () => {
  let files = dialog.showOpenDialog({
    title: "Add music",
    filters: [
      {
        name: "Audio (.mp3, .wav, .ogg, .m4a)",
      },
    ],
    properties: ["openDirectory"],
  });

  if (!files) return;
  for (let fileOrFolder of (await files).filePaths) {
    FS.readdir(fileOrFolder, (err, files) => {
      if (err) return;
      files.forEach(async (fileName) => {
        if (
          fileName.includes(".mp3") ||
          fileName.includes(".m4a") ||
          fileName.includes(".ogg") ||
          fileName.includes(".wav")
        ) {
          const pathToFile = PATH.join(fileOrFolder, fileName);
          parseAudioFile(pathToFile, "audioWithCover", false);
        }
      });
    });
  }
});

ipcMain.on("processDroppedFiles", (e, filePaths) => {
  if (Array.isArray(filePaths) && filePaths[0]) {
    win.webContents.send("normalMsg", "Processing Dropped Files");
    if (FS.lstatSync(filePaths[0]).isDirectory()) {
      loadFromAFolder(filePaths[0]);
    } else {
      filePaths.forEach((pathToFile) => {
        parseAudioFile(pathToFile, "audioWithCover", false);
      });
      setTimeout(() => {
        win.webContents.send("playNow");
      }, 1000);
    }
  }
});

ipcMain.on("loadMusicFolder", () => loadFromAFolder(MUSICFOLDER));
ipcMain.on("downloadBinaries", () => getBinaries());

function loadFromAFolder(folderPath) {
  FS.readdir(folderPath, (err, files) => {
    files.forEach(async (fileName) => {
      if (
        fileName.includes(".mp3") ||
        fileName.includes(".m4a") ||
        fileName.includes(".ogg") ||
        fileName.includes(".wav")
      ) {
        const pathToFile = PATH.join(folderPath, fileName);
        parseAudioFile(pathToFile, "audioWithCover", false);
      }
    });
  });
  setTimeout(() => {
    win.webContents.send("playNow");
  }, 1000);
}
ipcMain.on("loadArguments", (e) => {
  if (FILESINARGS) {
    if (FS.lstatSync(FILESINARGS).isDirectory()) {
      loadFromAFolder(FILESINARGS);
      win.webContents.send("playNow");
    } else {
      parseAudioFile(FILESINARGS, "audioWithCover", false);
      setTimeout(() => {
        win.webContents.send("playNow");
      }, 100);
    }
  }
});

async function parseAudioFile(
  pathToFile,
  response,
  parsingForPlaylistOrRecents
) {
  console.log("Parsing" + pathToFile);
  return new Promise((resolve) => {
    let dataToSendBack;
    const fileName = pathToFile.replace(/(.*)[\/\\]/, "");
    let cover;
    NodeID3.read(pathToFile, async function(err, tags) {
      if (tags && tags.image && tags.image.imageBuffer) {
        cover = `data:${
          tags.image.mime
        };base64,${tags.image.imageBuffer.toString("base64")}`;
      } else {
        cover = false;
      }
      await mm
        .parseFile(pathToFile)
        .then((data) => {
          const aditionalInfo = {
            duration: data.format.duration,
            formatedLength: secondsToTime(data.format.duration),
          };
          if (cover == false) {
            try {
              if (data.common.picture && data.common.picture[0]) {
                cover = `data:${
                  data.common.picture[0].format
                };base64,${data.common.picture[0].data.toString("base64")}`;
              } else {
                cover = "file://" + defaultThumbnail;
              }
            } catch (error) {
              console.log(error);
            }
          }
          const audioWithCover = {
            title: fileName
              .replace(".m4a", "")
              .replace(".mp3", "")
              .replace(".ogg", "")
              .replace(".wav", ""),
            artist: tags.artist || "unknown",
            album: tags.album || "unknown",
            path: "file://" + pathToFile,
            cover,
            duration: aditionalInfo.duration,
            formatedLength: aditionalInfo.formatedLength,
          };
          if (parsingForPlaylistOrRecents) {
            dataToSendBack = audioWithCover;
            resolve(dataToSendBack);
          } else {
            resolve();
            win.webContents.send(response, audioWithCover);
          }
        })
        .catch((err) => {
          console.log("error at mm parser");
          resolve();
        });
    });
  });
}
ipcMain.on("parseAddedTracks", (e, addedTracks) => {
  addedTracks.forEach((track) => {
    parseAudioFile(track, "audioWithCover", false);
  });
});
ipcMain.on("parsePlaylist", async (e, playlists) => {
  const playlistsToSend = [];
  await playlists.forEach(async (playlist) => {
    const playlistData = {
      name: playlist.name,
      tracks: [],
    };
    await playlist.tracks.forEach(async (trackLocation) => {
      const parsedTrack = await parseAudioFile(
        trackLocation,
        "loadPlaylists",
        true
      );
      console.log("*******");
      console.log(parsedTrack.title);
      console.log("*******");
      playlistData.tracks.unshift(parsedTrack);
      return win.webContents.send("addPlaylist", playlistData);
    });
  });
});

ipcMain.on("parseRecentlyPlayed", (e, recentsLocations) => {
  recentsLocations.forEach((recentTrack) => {
    parseAudioFile(recentTrack, "addToRecents", false);
  });
});
ipcMain.on("deleteFile", (e, fileLocation) => {
  deleteFile(fileLocation);
});
ipcMain.on("convertFile", (e, data) => {
  convertToFileType(data.path, data.outputFileType);
});
ipcMain.on("mergeFiles", (e, data) => {
  mergeFiles(data[0], data[1]);
});

function secondsToTime(sec) {
  if (sec) {
    var sec_num = parseInt(JSON.stringify(sec), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  }
  return "_ _ : _ _";
}

function getBinaries() {
  var platform = ffbinaries.detectPlatform();
  if (FS.existsSync(ffmpegPath)) return;
  sendMsgToFrontend("successMsg", "Downloading necessary dependanicies");
  return ffbinaries.downloadFiles(
    ["ffmpeg", "ffprobe"],
    { platform: platform, quiet: true, destination: APPDATAFOLDER },
    function(err, data) {
      console.log("Downloading binaries for " + platform + ":");
      console.log("err", err);
      console.log("The data from downloading bins is ", data);
    }
  );
}

async function convertToFileType(source, outputFileType) {
  const savePath =
    PATH.join(CONVERTEDFILESDIR, getFileName(source)) + `.${outputFileType}`;
  sendMsgToFrontend(
    "progressActionName",
    `Converting ${getFileName(source)} to ${outputFileType}`
  );
  await new Promise((resolve) => {
    try {
      ffmpeg(source)
        .toFormat(outputFileType)
        .on("error", (err) => {
          console.log("Error in converting: " + err.message);
        })
        .on("progress", (progress) => {
          console.log(Math.floor(progress.percent));
          sendMsgToFrontend("progressInfo", Math.floor(progress.percent));
          win.webContents.send(
            "conversionProgress",
            Math.floor(progress.percent)
          );
        })
        .on("end", () => {
          console.log("Processing finished !");
          parseAudioFile(savePath, "audioWithCover", false);
          resolve();
        })
        .save(savePath); //path where you want to save your file
    } catch (error) {
      resolve();
      console.log("Error in converting");
    }
  });
  return savePath;
}

function deleteFile(path) {
  FS.unlink(path.replace("file://", ""), (err) => {
    if (err) return sendMsgToFrontend("errorMsg", "Error in Deleting File");
    sendMsgToFrontend("successMsg", `${getFileName(path)} deleted`);
  });
  win.webContents.send("deleteComplete");
}
function sendMsgToFrontend(type, msg) {
  win.webContents.send(type, msg);
}
function getFileName(path) {
  return path
    .replace(/(.*)[\/\\]/, "")
    .split(".")[0]
    .replace("file://", "");
}
async function mergeFiles(files, outputFileName) {
  const savePath = PATH.join(MERGEDFILESDIR, outputFileName) + `.mp3`;
  const finalDuration = await getTotalFileDuration(files);
  console.log("FInal duration is " + finalDuration);
  const command = ffmpeg();
  files.forEach((file) => {
    command.input(file);
  });
  console.log("Merger started");
  command
    .on("start", function(data) {
      console.log("start data is  " + data);
      sendMsgToFrontend("progressActionName", `Merging files to ${savePath}`);
    })
    .on("error", function(err) {
      console.log("An error occurred: " + err.message);
      sendMsgToFrontend("errorMsg", "Error in merging files");
    })
    .on("progress", (progress) => {
      let currentTime = getTimestampFormat(JSON.stringify(progress.timemark));
      console.log("Current time is " + currentTime);
      const percent = Math.floor((currentTime * 100) / finalDuration);
      console.log(percent);
      sendMsgToFrontend("progressInfo", percent);
    })
    .on("end", async () => {
      console.log("Merging finished !");
      sendMsgToFrontend("successMsg", "Merging Finished");
      parseAudioFile(savePath, "audioWithCover", false);
    })
    .mergeToFile(savePath);
}
async function getTotalFileDuration(files) {
  let totalDuration = 0;
  for await (const file of files) {
    let fileData = await mm.parseFile(file);
    totalDuration += fileData.format.duration;
  }
  return Math.floor(totalDuration);
}
function getTimestampFormat(string) {
  let hours = parseInt(string.substr(1, 2));
  let minutes = parseInt(string.substr(4, 2));
  let seconds = parseInt(string.substr(7, 4));
  let timestamp = hours * 60 * 60 + minutes * 60 + seconds;
  return Math.floor(timestamp);
}
