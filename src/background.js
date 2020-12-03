"use strict";

import { app, protocol, BrowserWindow, dialog, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import * as defaultImage from "./Defaults.js";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const NodeID3 = require("node-id3");
const ID3Writer = require("browser-id3-writer");
const isDevelopment = process.env.NODE_ENV !== "production";
const FS = require("fs");
const PATH = require("path");
const MUSICFOLDER = require("path").join(require("os").homedir(), "Music");
const mm = require("music-metadata");
let openedWithFile;
console.log(process.argv);
if (process.argv[1]) {
  openedWithFile = process.argv[1];
}
app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});

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
  // loadMusicFromMusicFolder();

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

ipcMain.on("updateTrackInfo", async (e, data) => {
  const tags = {
    title: data.title,
    artist: data.artist,
    album: data.album,
    APIC: `src/art3.jpg`,
  };
  require("fs").writeFile("coverArt.png", data.base64Data, "base64", function(
    err
  ) {
    console.log(err);
  });
  let file = data.path;
  let success = NodeID3.write(tags, file);
  console.log(success);
  if (success) {
    win.webContents.send("tagWriteSuccessful");
    const folder = file.match(/(.*)[\/\\]/)[1] || "";
    const newFileName =
      PATH.join(folder, data.title) + `.${data.path.split(".").pop()}`;
    FS.rename(data.path, newFileName, () => console.log("rename successful"));
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
    filePaths.forEach((pathToFile) => {
      parseAudioFile(pathToFile, "audioWithCover", false);
    });
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
}
ipcMain.on("loadArguments", (e) => {
  if (FS.lstatSync(openedWithFile).isDirectory()) {
    loadFromAFolder(openedWithFile);
    win.webContents.send("playNow");
  } else {
    parseAudioFile(openedWithFile, "audioWithCover", false);
    win.webContents.send("playNow");
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
        cover = `data:image/png;base64,${defaultImage.default}`;
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
