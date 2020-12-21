"use strict";

import { app, protocol, BrowserWindow, dialog, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const NodeID3 = require("node-id3");
const isDevelopment = process.env.NODE_ENV !== "production";
const FS = require("fs");
const PATH = require("path");
const MUSICFOLDER = require("path").join(require("os").homedir(), "Music");
const APPDATAFOLDER = app.getPath("userData");
const ffmpeg = require("fluent-ffmpeg");
const mm = require("music-metadata");
const { DownloaderHelper } = require("node-downloader-helper");
const ffbinaries = require("ffbinaries");

const ffmpegPath = PATH.join(APPDATAFOLDER, "ffmpeg");
const ffprobePath = PATH.join(APPDATAFOLDER, "ffprobe");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

let FILESINARGS;

const defaultThumbnail = PATH.join(__static, "Thumbnail.png");

console.log(process.argv);
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
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      // console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

console.log(__static);
FS.readdir(__static, (err, files) => {
  files.forEach(async (fileName) => {
    console.log(fileName);
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
  console.log(stringForm.includes("https:"));
  //Checks if is from  google images
  if (stringForm.includes("https:")) {
    let downloadedCover;
    await new Promise((resolve) => {
      const dl = new DownloaderHelper(coverArt, APPDATAFOLDER);
      dl.start();
      dl.on("end", () => {
        console.log("downloadSuccesful");
        resolve((downloadedCover = dl.getDownloadPath()));
      });
    });
    return downloadedCover;
  }

  //Checks if it uses the default coverArt
  if (stringForm.includes("Thumbnail.png")) return defaultThumbnail;

  //Checks is its a dataURI String
  if (stringForm.includes("data:image")) {
    let builtCover;
    await new Promise((resolve) => {
      let coverPath;
      let base64ContentArray = coverArt.split(",");
      let mimeType = base64ContentArray[0].match(
        /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
      )[0];
      let base64Data = base64ContentArray[1];
      coverPath = PATH.join(
        MUSICFOLDER,
        `cover.${mimeType.replace("image/", "")}`
      );
      require("fs").writeFile(coverPath, base64Data, "base64", (err) => {
        if (err) {
          console.log("error in writing data URI to fs");
        } else {
          resolve((builtCover = coverPath));
        }
      });
    });
    console.log("Written cover path is " + builtCover);
    return builtCover;
  }
}

ipcMain.on("updateTrackInfo", async (e, data) => {
  const coverPath = await getCoverArtUrl(data.coverArt);
  console.log("Cover is at" + coverPath);
  const tags = {
    title: data.title,
    artist: data.artist,
    album: data.album,
    APIC: coverPath,
  };
  let file = data.path;
  let success = NodeID3.write(tags, file);
  console.log("Tag write is " + success);
  if (success) {
    const folder = file.match(/(.*)[\/\\]/)[1] || "";
    const mimeType = `.${data.path.split(".").pop()}`;
    const newFileName = data.title + mimeType;
    let newFilePath = PATH.join(folder, newFileName);
    newFilePath = newFilePath.replace(/\s\./g, ".");
    var isWin = process.platform === "win32";
    let slash = "/";
    if (isWin) slash = "\\";
    newFilePath = newFilePath.replace(/\/\s/g, slash);
    if (mimeType === ".m4a") {
      newFilePath = await convertToMp3(data.path, newFilePath);
      console.log(newFilePath);
    }
    // FS.rename(data.path, newFilePath, () => console.log("rename successful"));
    // console.log("New File is located at " + newFilePath);
    // parseAudioFile(newFilePath, "audioWithCover", false);
    // win.webContents.send("tagWriteSuccessful");
    // win.webContents.send("newFilePath");
    // console.log("==================================");
  } else {
    win.webContents.send("tagWriteError");
  }
});

ipcMain.on("addMusicFromFile", async () => {
  let files = dialog.showOpenDialog({
    title: "Add music",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg, .m4a)",
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
        name: "Sound (.mp3, .wav, .ogg, .m4a)",
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
  if (Array.isArray(filePaths)) {
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
  if (FS.lstatSync(FILESINARGS).isDirectory()) {
    loadFromAFolder(FILESINARGS);
    win.webContents.send("playNow");
  } else {
    parseAudioFile(FILESINARGS, "audioWithCover", false);
    setTimeout(() => {
      win.webContents.send("playNow");
    }, 100);
  }
});

async function parseAudioFile(
  pathToFile,
  response,
  parsingForPlaylistOrRecents
) {
  let dataToSendBack;
  const fileName = pathToFile.replace(/(.*)[\/\\]/, "");
  let cover;
  await mm
    .parseFile(pathToFile)
    .then((data) => {
      const picData = mm.selectCover(data.common.picture);
      if (picData) {
        cover = `data:${picData.format};base64,${picData.data.toString(
          "base64"
        )}`;
      } else {
        cover = "file://" + defaultThumbnail;
      }
      const audioWithCover = {
        title: fileName
          .replace(".m4a", "")
          .replace(".mp3", "")
          .replace(".ogg", "")
          .replace(".wav", ""),
        artist: data.common.artist || "unknown",
        album: data.common.album || "unknown",
        path: "file://" + pathToFile,
        cover,
        duration: data.format.duration,
        formatedLength: secondsToTime(data.format.duration),
      };
      if (parsingForPlaylistOrRecents) {
        dataToSendBack = audioWithCover;
      } else {
        win.webContents.send(response, audioWithCover);
      }
    })
    .catch((err) => {
      console.log("Error in parsing file =>" + pathToFile);

      console.log(err);
    });
  return dataToSendBack;
}
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
  console.log("=============");
  var platform = ffbinaries.detectPlatform();

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

getBinaries();
async function convertToMp3(source, savePath) {
  await new Promise((resolve) => {
    try {
      ffmpeg(source)
        .toFormat("mp3")
        .on("error", (err) => {
          console.log("Error in converting: " + err.message);
        })
        .on("progress", (progress) => {
          console.log("Processing: " + progress.targetSize + " KB converted");
        })
        .on("end", () => {
          console.log("Processing finished !");
          resolve();
        })
        .save(savePath); //path where you want to save your file
    } catch (error) {
      console.log("Error in converting");
      return merge(false);
    }
  });
  return savePath;
}
