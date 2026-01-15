// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      // 보안을 위해 preload 스크립트 사용
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // [기능 1: 랜덤 센서 데이터 생성]
  // 1초마다 데이터를 만들어 화면(Renderer)으로 보냅니다.
  setInterval(() => {
    // 20~30도 사이의 랜덤 온도 생성
    const randomTemp = (20 + Math.random() * 10).toFixed(1);
    
    // 'update-sensor'라는 채널로 데이터를 쏨
    if (mainWindow) {
        mainWindow.webContents.send('update-sensor', randomTemp);
        console.log(`센서 데이터 생성됨: ${randomTemp}`); // 터미널 확인용
    }
  }, 1000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});