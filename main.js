// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const si = require('systeminformation'); // systeminformation 모듈

let mainWindow;

// [삭제됨] 기존의 복잡한 wmic 기반 getCpuTemperature 함수는 제거했습니다.

// [유지] CPU 정보 계산을 위한 도우미 함수
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
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // [초기값] CPU 사용량 계산을 위한 초기값 저장
  let previousCpuInfo = getCpuInfo();

  // [기능 1: 실제 센서 데이터 생성]
  // 1초(1000ms)마다 데이터를 갱신합니다. (하드웨어 센서 호출은 부하가 있으므로 100ms는 너무 빠릅니다)
  setInterval(async () => {
    
    // [변경] 1. si.cpuTemperature()로 실제 온도 가져오기
    let cpuTemp = 0;
    try {
        const tempData = await si.cpuTemperature();
        // tempData.main이 메인 CPU 온도입니다.
        if (tempData.main && tempData.main > 0) {
            cpuTemp = tempData.main.toFixed(1);
        } else {
            // 온도를 못 가져온 경우 (관리자 권한 부족, 센서 미지원 등)
            // 테스트를 위해 랜덤값으로 대체하거나 'N/A'로 표시
            cpuTemp = (20 + Math.random() * 10).toFixed(1); 
            // console.log('온도 센서 읽기 실패, 가상 데이터 사용');
        }
    } catch (e) {
        console.error(e);
        cpuTemp = (20 + Math.random() * 10).toFixed(1);
    }

    // [유지] 2. RAM 사용량 계산
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsage = ((usedMem / totalMem) * 100).toFixed(1);

    // [유지] 3. CPU 사용량 계산
    const currentCpuInfo = getCpuInfo();
    const idleDiff = currentCpuInfo.idle - previousCpuInfo.idle;
    const totalDiff = currentCpuInfo.total - previousCpuInfo.total;
    const cpuUsage = (100 - (idleDiff / totalDiff) * 100).toFixed(1);
    
    previousCpuInfo = currentCpuInfo; // 다음 계산을 위해 갱신
    
    // 'update-sensor' 채널로 데이터 전송
    if (mainWindow) {
        mainWindow.webContents.send('update-sensor', {
            temp: cpuTemp,
            cpu: cpuUsage,
            ram: ramUsage
        });
    }
  }, 1000); // 1000ms = 1초
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});