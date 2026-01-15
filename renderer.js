// renderer.js
const tempElement = document.getElementById('temperature');
const cpuElement = document.getElementById('cpu-usage');
const ramElement = document.getElementById('ram-usage');

// preload.js에서 정의한 'electronAPI'를 통해 데이터를 받음
window.electronAPI.onUpdateSensor((data) => {

    const { temp, cpu, ram } = data;

    tempElement.innerText = temp;
    cpuElement.innerText = `${cpu}%`;
    ramElement.innerText = `${ram}%`;
    
    // 온도에 따라 색상 및 배경 변경 효과
    if (temp > 28) {
        tempElement.style.color = '#ff4757';
        tempElement.style.background = 'rgba(255, 71, 87, 0.2)';
        tempElement.style.borderColor = '#ff4757';
        tempElement.style.textShadow = '0 0 10px rgba(255, 71, 87, 0.5)';
    } else if (temp > 22) {
        tempElement.style.color = '#ffa502';
        tempElement.style.background = 'rgba(255, 165, 2, 0.2)';
        tempElement.style.borderColor = '#ffa502';
        tempElement.style.textShadow = '0 0 10px rgba(255, 165, 2, 0.5)';
    } else {
        tempElement.style.color = '#00d2d3';
        tempElement.style.background = 'rgba(0, 210, 211, 0.2)';
        tempElement.style.borderColor = '#00d2d3';
        tempElement.style.textShadow = '0 0 10px rgba(0, 210, 211, 0.5)';
    }
});

// renderer.js (기존 코드 아래에 추가)
const clockBtn = document.getElementById('clock-btn');
const clockDisplay = document.getElementById('clock-display');
let clockInterval; // 타이머를 저장할 변수

clockBtn.addEventListener('click', () => {
    // 1. 시계 영역이 숨겨져 있다면? -> 보여주기
    if (clockDisplay.classList.contains('hidden')) {
        clockDisplay.classList.remove('hidden'); // 숨김 해제
        clockBtn.innerText = "시계 숨기기"; // 버튼 글자 변경

        // 즉시 시간 표시 후 1초마다 갱신 시작
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    } 
    // 2. 이미 보이고 있다면? -> 숨기기
    else {
        clockDisplay.classList.add('hidden'); // 다시 숨김
        clockBtn.innerText = "시간 확인하기"; // 버튼 글자 원상복구
        
        // 시계 멈추기 (성능 절약)
        clearInterval(clockInterval);
    }
});

// 현재 시간을 가져와서 화면에 찍어주는 함수
function updateClock() {
    const now = new Date();
    // '오후 7:30:15' 형식으로 예쁘게 만듦
    const timeString = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    clockDisplay.innerText = timeString;
}