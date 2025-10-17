const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 925,
    resizable: true,
    minWidth: 1280,
    minHeight: 720,
    useContentSize: true,
    autoHideMenuBar: true,
    frame: false,
    transparent: false,
    roundedCorners: true,
    backgroundColor: '#181818',
    icon: path.join(__dirname, '../src/assets/listify_logo.png'), // 🧩 AJOUT ICI
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  win.setTitle('Listify')

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.center()

  // 🧠 GESTION DES COMMANDES DE FENÊTRE
  ipcMain.on('window-minimize', () => win.minimize())
  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  })
  ipcMain.on('window-close', () => win.close())
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
