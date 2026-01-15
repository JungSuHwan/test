// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os'); // [추가] OS 모듈 불러오기

let mainWindow;

// [추가] CPU 정보 계산을 위한 도우미 함수 (파일 맨 아래에 둬도 됩니다)
function getCpuInfo() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  }
  return { idle, total };
}

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

  // [추가] CPU 사용량 계산을 위한 초기값 저장
  let previousCpuInfo = getCpuInfo();

  // [기능 1: 랜덤 센서 데이터 생성]
  // 1초마다 데이터를 만들어 화면(Renderer)으로 보냅니다.
  setInterval(() => {
    // 20~30도 사이의 랜덤 온도 생성
    const randomTemp = (20 + Math.random() * 10).toFixed(1);

    // [추가] 2. RAM 사용량 계산
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsage = ((usedMem / totalMem) * 100).toFixed(1);

    // [추가] 3. CPU 사용량 계산
    const currentCpuInfo = getCpuInfo();
    const idleDiff = currentCpuInfo.idle - previousCpuInfo.idle;
    const totalDiff = currentCpuInfo.total - previousCpuInfo.total;
    const cpuUsage = (100 - (idleDiff / totalDiff) * 100).toFixed(1);
    
    previousCpuInfo = currentCpuInfo; // 다음 계산을 위해 갱신
    
    // 'update-sensor'라는 채널로 데이터를 쏨
  if (mainWindow) {
        mainWindow.webContents.send('update-sensor', {
            temp: randomTemp,
            cpu: cpuUsage,
            ram: ramUsage
        });
    }
  }, 100);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});