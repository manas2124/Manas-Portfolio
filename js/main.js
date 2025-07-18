document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);

    // Toggle menu function
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on window resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Project scroll functionality
    document.querySelectorAll('.category-container').forEach(container => {
        const scrollContainer = container.querySelector('.project-scroll');
        const leftBtn = container.querySelector('.left-btn');
        const rightBtn = container.querySelector('.right-btn');
        
        function updateScrollAmount() {
            // Get the width of a single card including its gap
            const cardWidth = scrollContainer.querySelector('.project-card').offsetWidth;
            const gap = 32; // 2rem gap in pixels
            
            // Always scroll one card at a time
            return cardWidth + gap;
        }
        
        leftBtn.addEventListener('click', () => {
            const scrollAmount = updateScrollAmount();
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        rightBtn.addEventListener('click', () => {
            const scrollAmount = updateScrollAmount();
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll buttons based on scroll position
        scrollContainer.addEventListener('scroll', () => {
            const isAtStart = scrollContainer.scrollLeft === 0;
            const isAtEnd = scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth;
            
            leftBtn.style.opacity = isAtStart ? '0.5' : '1';
            rightBtn.style.opacity = isAtEnd ? '0.5' : '1';
        });
        
        // Update scroll amount on window resize
        window.addEventListener('resize', () => {
            // Recalculate scroll amount when window is resized
            updateScrollAmount();
        });
        
        // Initial button state
        leftBtn.style.opacity = '0.5';
    });
}); 


async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    appendMessage('You', userInput);

    const reply = await getBotReply(userInput);

    appendMessage('Bot', reply);

    document.getElementById('userInput').value = '';
}

function appendMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function getBotReply(userMessage) {
    const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    return data.reply;
}
