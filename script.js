document.addEventListener('DOMContentLoaded', () => {
    // Hover effect for construction icon
    const constructionIcon = document.querySelector('.construction-icon i');
    if (constructionIcon) {
        constructionIcon.addEventListener('mouseenter', () => {
            constructionIcon.style.transform = 'scale(1.2) rotate(10deg)';
            constructionIcon.style.transition = 'transform 0.3s ease';
        });
        constructionIcon.addEventListener('mouseleave', () => {
            constructionIcon.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Typing effect
    const message = document.querySelector('.message');
    if (message) {
        const originalText = message.textContent;
        message.textContent = '';
        let index = 0;
        const typeWriter = () => {
            if (index < originalText.length) {
                message.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    // Countdown timer - add extra days here
    let releaseDate = new Date('September 30, 2025 00:00:00');
    releaseDate.setDate(releaseDate.getDate() + 50);
    releaseDate = releaseDate.getTime();

    const dateBox = document.querySelector('.date-box');
    
    const updateCountdown = () => {
        const now = Date.now();
        const distance = releaseDate - now;
        
        if (distance <= 0) {
            dateBox.innerHTML = '<span class="label">We are live!</span>';
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        dateBox.innerHTML = 
            '<span class="label">Launching in</span>' +
            `<div class="countdown"><span>${days}d ${hours}h ${minutes}m ${seconds}s</span></div>`;
    };
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
});
