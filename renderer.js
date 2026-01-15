// renderer.js
const tempElement = document.getElementById('temperature');

// preload.js에서 정의한 'electronAPI'를 통해 데이터를 받음
window.electronAPI.onUpdateSensor((value) => {
    tempElement.innerText = value;
    
    // 온도에 따라 색상 및 배경 변경 효과
    if (value > 28) {
        tempElement.style.color = '#ff4757';
        tempElement.style.background = 'rgba(255, 71, 87, 0.2)';
        tempElement.style.borderColor = '#ff4757';
        tempElement.style.textShadow = '0 0 10px rgba(255, 71, 87, 0.5)';
    } else if (value > 22) {
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