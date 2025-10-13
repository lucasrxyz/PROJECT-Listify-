const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 925,
    resizable: true,
    minWidth: 800,
    minHeight: 450,
    maxWidth: 1920,
    maxHeight: 1080,
    useContentSize: true,
    autoHideMenuBar: true, // ❌ Pas de menu Windows
    frame: false, // ❌ Pas de barre Windows
    transparent: false, // peut être true si tu veux que le fond soit transparent
    roundedCorners: true, // ✅ Coins arrondis (Win11/macOS)
    backgroundColor: '#181818', // ton fond d’app pour éviter le flash blanc
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

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
