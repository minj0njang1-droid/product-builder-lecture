const foods = [
    { name: '김치찌개', category: '한식', emoji: '🥘' },
    { name: '된장찌개', category: '한식', emoji: '🍲' },
    { name: '비빔밥', category: '한식', emoji: '🥗' },
    { name: '불고기', category: '한식', emoji: '🍖' },
    { name: '제육볶음', category: '한식', emoji: '🐷' },
    { name: '치킨', category: '양식/배달', emoji: '🍗' },
    { name: '피자', category: '양식/배달', emoji: '🍕' },
    { name: '파스타', category: '양식', emoji: '🍝' },
    { name: '돈가스', category: '일식', emoji: '🍱' },
    { name: '초밥', category: '일식', emoji: '🍣' },
    { name: '라멘', category: '일식', emoji: '🍜' },
    { name: '짜장면', category: '중식', emoji: '🥢' },
    { name: '짬뽕', category: '중식', emoji: '🌶️' },
    { name: '탕수육', category: '중식', emoji: '🥟' },
    { name: '햄버거', category: '패스트푸드', emoji: '🍔' },
    { name: '샌드위치', category: '브런치', emoji: '🥪' },
    { name: '쌀국수', category: '아시안', emoji: '🥣' },
    { name: '마라탕', category: '중식', emoji: '🥘' },
    { name: '삼겹살', category: '한식', emoji: '🥓' },
    { name: '떡볶이', category: '분식', emoji: '🍡' }
];

const recommendBtn = document.getElementById('recommend-btn');
const resultContainer = document.getElementById('result-container');
const categoryTag = document.getElementById('category');
const foodName = document.getElementById('food-name');
const foodEmoji = document.getElementById('food-emoji');

recommendBtn.addEventListener('click', () => {
    // 애니메이션 효과
    resultContainer.classList.remove('animate');
    void resultContainer.offsetWidth; // reflow
    resultContainer.classList.add('animate');

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * foods.length);
    const selectedFood = foods[randomIndex];

    // 결과 표시
    setTimeout(() => {
        categoryTag.textContent = selectedFood.category;
        foodName.textContent = selectedFood.name;
        foodEmoji.textContent = selectedFood.emoji;
    }, 100);
});
