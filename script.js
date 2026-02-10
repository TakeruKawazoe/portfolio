// ========================================
// ハンバーガーメニュー
// ========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// ナビリンクをクリックしたらメニューを閉じる
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========================================
// スクロール時のナビゲーション背景変更
// ========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 23, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 14, 23, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// 多角形ネットワーク背景アニメーション
// ========================================
function initPolygonNetwork() {
    const canvas = document.getElementById('polygonCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // キャンバスサイズ設定
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // パーティクル（頂点）クラス
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 境界での反射
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00e5ff';
            ctx.fill();
        }
    }
    
    // パーティクル初期化
    function initParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < Math.min(particleCount, 100); i++) {
            particles.push(new Particle());
        }
    }
    
    initParticles();
    
    // ライン描画（多角形ネットワーク）
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // グラデーションライン
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(0, 229, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(0, 255, 136, ${opacity})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // アニメーションループ
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // パーティクル更新と描画
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // ライン描画
        ctx.shadowBlur = 0;
        drawLines();
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // リサイズ時にパーティクル再初期化
    window.addEventListener('resize', () => {
        initParticles();
    });
}

initPolygonNetwork();

// ========================================
// スキルバーのアニメーション
// ========================================
const skillProgressBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillProgressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
};

// Intersection Observerでスキルセクションが表示されたらアニメーション
const skillsSection = document.querySelector('.skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillsObserver.observe(skillsSection);

// ========================================
// フェードインアニメーション
// ========================================
const fadeElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-card, .vision-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.classList.add('hidden');
    fadeObserver.observe(el);
});

// ========================================
// スムーズスクロール（Safari対応）
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// タイピングエフェクト（オプション）
// ========================================
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// ========================================
// 現在の年を自動更新
// ========================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
    footerText.innerHTML = `&copy; ${currentYear} 川添 偉生 (Takeru Kawazoe). All Rights Reserved.`;
}

// ========================================
// ページ読み込み完了時の処理
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
