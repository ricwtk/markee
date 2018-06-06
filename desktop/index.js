const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');
const os = require("os");
const path = require('path');
const url = require('url');
const fs = require("fs");
const process = require("process");
const child_process = require("child_process");
const fm = require("font-manager");

let win;

console.log(process.argv);

const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {label: "Save file", accelerator: "CommandOrControl+S", click: () => { win.webContents.send("save-file"); }},
      {label: "Open file...", accelerator: "CommandOrControl+O", click: () => { win.webContents.send("open-file-ui"); }},
      {label: "New file", accelerator: "CommandOrControl+N", click: newFile},
      {type: "separator"},
      {label: "Preference", click: () => { win.webContents.send("open-preferences"); }}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {label: "Render as document", accelerator: "CommandOrControl+Shift+D", click: () => { win.webContents.send("render-as-document"); }},
      {label: "Render as slides", accelerator: "CommandOrControl+Shift+S", click: () => { win.webContents.send("render-as-slides"); }}
    ]
  },
  // {
  //   label: 'Dev',
  //   submenu: [
  //     {role: 'reload'},
  //     {role: 'forcereload'},
  //     {role: 'toggledevtools'},
  //     {type: 'separator'},
  //     {role: 'resetzoom'},
  //     {role: 'zoomin'},
  //     {role: 'zoomout'},
  //     {type: 'separator'},
  //     {role: 'togglefullscreen'}
  //   ]
  // },
  {
    role: 'help',
    submenu: [
      {
        label: "About Markee",
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      },
      {label: "Markdown Guide", click: () => { win.webContents.send("open-help"); }},
      {label: "Markee web"}
    ]
  }
]);


function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, "icons", "icon.png"), 
    width: 800, 
    height: 600
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
    show: false
  }));

  win.on("ready-to-show", () => {
    win.show();
  })

  win.on('closed', () => {
    win = null;
  })

  var handleRedirect = (e, urlStr) => {
    if (urlStr != win.webContents.getURL() 
      && !urlStr.endsWith("snippets/cloned-doc.html")
      && !urlStr.endsWith("snippets/cloned-slides.html")) {
      e.preventDefault();
      shell.openExternal(urlStr);
    }
  };
  
  win.webContents.on('will-navigate', handleRedirect)
  win.webContents.on('new-window', handleRedirect)

  win.setMenu(menu);
  if (process.platform == 'darwin') {
    Menu.setApplicationMenu(menu);
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on("app-ready", (ev) => {
  let fileToRead;
  if ((process.argv[0].endsWith("electron") && process.argv.length > 2)
    || (!process.argv[0].endsWith("electron") && process.argv.length > 1)) {
    fileToRead = process.argv[process.argv.length - 1];
  }
  if (fileToRead) {
    let p = path.parse(fileToRead);
    win.setTitle([p.base, p.dir, "Markee"].join(" - "));
    fs.readFile(fileToRead, (err, data) => {
      if (err) throw err;
      ev.sender.send("file-content", data.toString());
    });
  }
});

ipcMain.on("open-file", (ev, extraArg) => {
  console.log("opening " + extraArg);
  let cmd, arg;
  if (process.argv[0].endsWith("electron")) {
    cmd = process.argv[0];
    arg = [process.argv[1], extraArg];
  } else {
    cmd = process.argv[0];
    arg = [extraArg];
  }
  child_process.spawn(cmd, arg, {
    detached: true,
    stdio: 'ignore'
  }).unref();
});

ipcMain.on("save-file", (ev, filename, content) => {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err;
    ev.sender.send("save-file-success", content);
    let p = path.parse(filename);
    win.setTitle([p.base, p.dir, "Markee"].join(" - "));
  });
});

function newFile() {
  console.log("opening new file");
  let cmd, arg;
  if (process.argv[0].endsWith("electron")) {
    cmd = process.argv[0];
    arg = [process.argv[1]];
  } else {
    cmd = process.argv[0];
    arg = [];
  }
  child_process.spawn(cmd, arg, {
    detached: true,
    stdio: 'ignore'
  }).unref();
}
ipcMain.on("new-file", newFile);

ipcMain.on("open-external", (ev, dpath) => { shell.openItem(dpath) });

ipcMain.on("get-hljs-themes", (ev) => {
  ev.returnValue = fs.readdirSync(path.join(__dirname, "css", "highlight")).filter(f => f.endsWith(".css")).map(f => path.parse(f).name);
});

ipcMain.on("get-available-fonts", (ev) => {
  fonts = {};
  fm.getAvailableFonts(allFonts => {
    allFonts.forEach(fn => {
      if (fonts.hasOwnProperty(fn.family)) {
        fonts[fn.family].push(fn.weight);
      } else {
        fonts[fn.family] = [fn.weight];
      }
    });
    Object.keys(fonts).forEach(name => {
      fonts[name] = fonts[name].filter((wg,i) => i == fonts[name].indexOf(wg)).sort();
    });
    ev.sender.send("update-available-fonts", fonts);
  });
});

function getPrefLocation() {
  let settingFolder = "";
  switch (os.platform()) {
    case "linux":
      settingFolder = path.join(os.homedir(), ".local", "share");
      break;
    default:
      settingFolder = os.homedir();
  }
  if (!fs.statSync(settingFolder).isDirectory()) fs.mkdirSync();
  let fileLocation = path.join(settingFolder, "markee.pref");
  return { location: fileLocation, exist: fs.existsSync(fileLocation) };
}
ipcMain.on("get-preferences", (ev) => {
  let pref = getPrefLocation();
  let prefContent = {};
  if (pref.exist) {
    prefContent = JSON.parse(fs.readFileSync(pref.location).toString());
  }
  ev.sender.send("update-preferences", prefContent);
});
ipcMain.on("save-preferences", (ev, arg) => {
  fs.writeFileSync(getPrefLocation().location, JSON.stringify(arg, null, 2));
});
