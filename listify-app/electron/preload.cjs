const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  getSystemAudio: async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[0].id
        }
      },
      video: false
    })
    return stream
  }
})
