document.addEventListener("DOMContentLoaded", () => {
  // Define the relationship start date
  const RELATIONSHIP_START_DATE = new Date("March 4, 2025");
  
  // Enable lightbox for photos when clicked
  initLightbox();
  
  // Periodic confetti animation for special occasions
  checkForSpecialOccasions();
  
  // Apply hover effects on timeline items
  applyHoverEffects();
});

// Initialize lightbox functionality for photos
function initLightbox() {
  document.querySelectorAll('.photo-item img').forEach(image => {
    image.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      
      const imgSrc = image.getAttribute('src');
      const caption = image.parentElement.querySelector('.photo-caption')?.textContent || '';
      
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="close-lightbox">&times;</span>
          <img src="${imgSrc}" alt="Enlarged photo">
          ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
        </div>
      `;
      
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Add fade-in animation
      setTimeout(() => {
        lightbox.style.opacity = 1;
      }, 10);
      
      // Close lightbox when clicking the close button or outside the image
      lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      });
      
      function closeLightbox() {
        lightbox.style.opacity = 0;
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      }
    });
  });
}

// Check if today is a special occasion like anniversaries
function checkForSpecialOccasions() {
  const today = new Date();
  const startDate = new Date("March 4, 2025");
  
  // Check if it's a monthly anniversary (4th of each month)
  if (today.getDate() === 4) {
    celebrateWithConfetti();
  }
  
  // Check for other milestones
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 100 || diffDays === 365 || diffDays % 100 === 0) {
    celebrateWithConfetti();
  }
}

// Add confetti animation to celebrate special occasions
function celebrateWithConfetti() {
  // Create a confetti container if it doesn't exist
  let confettiContainer = document.querySelector('.confetti-container');
  
  if (!confettiContainer) {
    confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
  }
  
  // Generate confetti particles
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Random properties for varied appearance
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    // Random colors
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd166', '#f9f9f9', '#292f36'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    confettiContainer.appendChild(confetti);
  }
  
  // Remove confetti after animation completes
  setTimeout(() => {
    confettiContainer.remove();
  }, 8000);
}

// Apply various hover effects to timeline items
function applyHoverEffects() {
  document.querySelectorAll('.timeline-content').forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Scale up the date text slightly
      const dateText = item.querySelector('h2');
      if (dateText) {
        gsap.to(dateText, {
          scale: 1.05, 
          color: '#ff5252',
          duration: 0.3
        });
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const dateText = item.querySelector('h2');
      if (dateText) {
        gsap.to(dateText, {
          scale: 1,
          color: '#ff6b6b',
          duration: 0.3
        });
      }
    });
  });
}
