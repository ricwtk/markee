const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  })
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

const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {label: "Save file", accelerator: "CommandOrControl+S", click: () => { win.webContents.send("save-file"); }},
      {label: "Open file...", accelerator: "CommandOrControl+O", click: () => { win.webContents.send("open-file-ui"); }},
      {label: "New file", submenu: [
        {label: "Presentation"},
        {label: "Document"}
      ]},
      {type: "separator"},
      {label: "Preference"}
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
      {label: "Render as document", accelerator: ""},
      {label: "Render as slides", accelerator: ""},
      {label: "Full screen presentation", accelerator: "F11"}
    ]
  },
  {
    label: 'Dev',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: "About Markee",
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      },
      {label: "Markdown Guide"},
      {label: "Markee web"}
    ]
  }
]);
Menu.setApplicationMenu(menu);

ipcMain.on("open-file", (ev, arg) => {
  console.log("opening " + arg);
  win.setTitle(arg + " - Markee");
  fs.readFile(arg, (err, data) => {
    if (err) throw err;
    ev.sender.send("file-content", data.toString());
  });
})

ipcMain.on("save-file", (ev, filename, content) => {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err;
    ev.sender.send("save-file-success", content);
  });
})