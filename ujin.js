
let mission = 1;
let hiddenBox = Math.floor(Math.random() * 9) + 1;
let messageElement = document.getElementById('message');
let instructionElement = document.getElementById('instruction');
let rewardElement = document.getElementById('reward');
let rewardImage = document.getElementById('rewardImage');
let lifeCount = 3;
let player, monster, goal;
let playerPosition = { left: 0, top: 0 };
let monsterPosition = { left: 200, top: 200 };
let moveInterval;
let map; // 지도 변수 전역으로 선언

function checkBox(boxNumber) {
    if (mission === 1) {
        if (boxNumber === hiddenBox) {
            showSuccess("축하해! 너 오늘은 좀 치네 ㅋ 다음 미션으로 넘어갈게.");
            showReward();
            setTimeout(() => {
                startMission2();
            }, 3000);
        } else {
            showFailure("⸌◦̈⃝⸍ʷʰʸˀ̣ˀ̣ˀ̣ 땡 ! 틀렸어 다시 시도해봐.");
        }
        animateBox(boxNumber);
    }
}

function animateBox(boxNumber) {
    const box = document.querySelector(`.box:nth-child(${boxNumber})`);
    box.innerHTML = `<img src="Youjin${boxNumber}.jpg" alt="선물" />`;
    const img = box.querySelector('img');
    img.style.opacity = 1; // 이미지를 서서히 나타나게 함
}

function showReward() {
    rewardElement.style.visibility = 'visible';
    rewardElement.classList.add('show');
}

function showSuccess(message) {
    messageElement.style.visibility = 'visible';
    messageElement.textContent = message;
}

function showFailure(message) {
    messageElement.style.visibility = 'visible';
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.style.visibility = 'hidden';
    }, 2000);
}

function startMission2() {
    mission = 2;
    instructionElement.textContent = "미션 2: 간단한 퀴즈에 답해보세요!";
    document.getElementById('grid').style.display = 'none'; // 박스 숨기기
    document.getElementById('quiz').style.display = 'block'; // 퀴즈 보이기
}

function checkAnswer() {
    let answer = document.getElementById('quiz-answer').value;
    let correctAnswer = "174"; // 맞는 답변
    let quizMessage = document.getElementById('quiz-message');
    quizMessage.style.visibility = 'visible';

    if (answer === correctAnswer) {
        quizMessage.textContent = "축하해! 너 오늘은 좀 치네 ㅋ 다음 미션으로 넘어갈게.";
        setTimeout(() => {
            startMission3();
        }, 2000);
    } else {
        quizMessage.textContent = "⸌◦̈⃝⸍ʷʰʸˀ̣ˀ̣ˀ̣? 땡 ! 틀렸어 다시 시도해봐.";
        setTimeout(() => {
            quizMessage.style.visibility = 'hidden';
        }, 2000);
    }
}

function startMission3() {
    mission = 3;
    instructionElement.textContent = "미션 3: 몬스터를 피해서 목표 지점에 도달하세요!";
    document.getElementById('quiz').style.display = 'none'; // 퀴즈 숨기기
    document.getElementById('maze').style.display = 'block'; // 미로 보이기
    initializeMaze();
}

function initializeMaze() {
    player = document.getElementById('player');
    monster = document.getElementById('monster');
    goal = document.getElementById('goal');

    // goal을 맨 오른쪽 아래로 배치
    goal.style.left = '280px';  // 미로의 크기가 300px인 경우
    goal.style.top = '280px';

    resetPositions();
}

function resetPositions() {
    playerPosition = { left: 0, top: 0 };
    monsterPosition = { left: 200, top: 200 }; // 초기 몬스터 위치

    updatePlayerPosition();
    updateMonsterPosition();
}

function movePlayer(direction) {
    switch (direction) {
        case 'up':
            playerPosition.top = Math.max(playerPosition.top - 20, 0);
            break;
        case 'down':
            playerPosition.top = Math.min(playerPosition.top + 20, 300); // 300은 container의 높이
            break;
        case 'left':
            playerPosition.left = Math.max(playerPosition.left - 20, 0);
            break;
        case 'right':
            playerPosition.left = Math.min(playerPosition.left + 20, 300); // 300은 container의 너비
            break;
    }
    updatePlayerPosition();
    checkCollision();
}

function updatePlayerPosition() {
    player.style.left = `${playerPosition.left}px`;
    player.style.top = `${playerPosition.top}px`;
}

function updateMonsterPosition() {
    monster.style.left = `${monsterPosition.left}px`;
    monster.style.top = `${monsterPosition.top}px`;
}

function checkCollision() {
    // 플레이어와 몬스터 충돌 체크
    if (
        playerPosition.left < monsterPosition.left + 100 &&
        playerPosition.left + 100 > monsterPosition.left &&
        playerPosition.top < monsterPosition.top + 100 &&
        playerPosition.top + 100 > monsterPosition.top
    ) {
        loseLife();
    }

    // 플레이어와 goal 충돌 체크
    if (
        playerPosition.left < parseInt(goal.style.left) + 20 && 
        playerPosition.left + 100 > parseInt(goal.style.left) &&
        playerPosition.top < parseInt(goal.style.top) + 20 && 
        playerPosition.top + 100 > parseInt(goal.style.top)
    ) {
        alert("축하합니다! 목표에 도달했습니다!");
        startMission4();  // 미션 4로 이동
    }
}

function loseLife() {
    lifeCount--;
    document.getElementById('life-count').textContent = lifeCount;
    if (lifeCount <= 0) {
        alert("게임 오버! 다시 시작합니다.");
        lifeCount = 3;
        document.getElementById('life-count').textContent = lifeCount;
    }
    resetPositions();
}

// 몬스터가 플레이어를 추적하는 함수
function moveMonsterTowardsPlayer() {
    if (monsterPosition.left < playerPosition.left) {
        monsterPosition.left += 2; // 몬스터가 오른쪽으로 이동 (속도 증가)
    } else if (monsterPosition.left > playerPosition.left) {
        monsterPosition.left -= 2; // 몬스터가 왼쪽으로 이동 (속도 증가)
    }

    if (monsterPosition.top < playerPosition.top) {
        monsterPosition.top += 2; // 몬스터가 아래로 이동 (속도 증가)
    } else if (monsterPosition.top > playerPosition.top) {
        monsterPosition.top -= 2; // 몬스터가 위로 이동 (속도 증가)
    }

    updateMonsterPosition();
}

// 조이스틱 버튼을 누르고 있는 동안 지속적으로 이동
function startMoving(direction) {
    moveInterval = setInterval(() => {
        movePlayer(direction);
        moveMonsterTowardsPlayer(); // 몬스터도 플레이어를 추적
    }, 100); // 100ms마다 이동
}

function stopMoving() {
    clearInterval(moveInterval);
}

// 모바일에서 마우스 버튼을 눌렀을 때 발생하는 기본 이벤트 방지
document.addEventListener('touchstart', function(e) {
    e.preventDefault();
});

// 몬스터의 이동을 주기적으로 수행
setInterval(moveMonsterTowardsPlayer, 500); // 500ms마다 몬스터 이동

// 미션 4로 넘어가는 함수 추가
function startMission4() {
    // 미션 3 숨기기
    document.getElementById('maze').style.display = 'none';
    
    // 미션 4 컨테이너 보이기
    document.getElementById('map-container').style.display = 'block';

    alert("미션 4 시작! 카카오 API 지도를 표시합니다.");
    initializeMap(); // 카카오 지도 API 초기화
}

function initializeMap() {
    const mapContainer = document.getElementById('kakaoMap'); // 지도가 표시될 div
    const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 초기 위치
        level: 3 // 지도의 확대 레벨
    };
    map = new kakao.maps.Map(mapContainer, options); // 지도 생성
}

// 테스터용 버튼 클릭 시 미션 4로 이동
document.getElementById('tester-button').addEventListener('click', () => {
    startMission4();
});
