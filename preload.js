// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 메인 프로세스에서 보낸 데이터를 받는 리스너(함수) 정의
  onUpdateSensor: (callback) => ipcRenderer.on('update-sensor', (event, value) => callback(value))
});