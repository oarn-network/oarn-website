// OARN Landing Page JavaScript

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                navButtons.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.feature-card, .token-card, .path-card, .step, .contract-item').forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });

    // Copy contract address to clipboard
    document.querySelectorAll('.contract-address').forEach(el => {
        el.style.cursor = 'pointer';
        el.title = 'Click to copy';

        el.addEventListener('click', async function() {
            const address = this.textContent;
            try {
                await navigator.clipboard.writeText(address);

                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.color = '#22c55e';

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 1500);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // Dynamic stats counter (placeholder for live data)
    async function updateStats() {
        // In production, fetch from API or blockchain
        // For now, just animate the existing values
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            stat.classList.add('loaded');
        });
    }

    updateStats();

    // Network animation enhancement
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'scale(1.5)';
            node.style.background = '#22d3ee';
        });
        node.addEventListener('mouseleave', () => {
            node.style.transform = '';
            node.style.background = '';
        });
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-target {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .navbar.scrolled {
        background: rgba(15, 13, 26, 0.95);
    }

    .stat-value {
        transition: transform 0.3s ease;
    }

    .stat-value.loaded {
        transform: scale(1);
    }

    @media (max-width: 768px) {
        .nav-links.active,
        .nav-buttons.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 72px;
            left: 0;
            right: 0;
            background: var(--background);
            padding: 24px;
            border-bottom: 1px solid var(--border);
        }

        .nav-links.active {
            gap: 16px;
        }

        .nav-buttons.active {
            gap: 12px;
            border-top: 1px solid var(--border);
            padding-top: 24px;
            margin-top: 24px;
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log(`
%c OARN - Open AI Research Network %c

Decentralized AI infrastructure for open research.

GitHub: https://github.com/oarn-network
Docs: https://github.com/oarn-network/oarn-docs
Twitter: https://twitter.com/OARNNetwork
Discord: https://discord.gg/RsrQwNvt

Contracts (Arbitrum Sepolia):
- OARNRegistry: 0xa122518Cb6E66A804fc37EB26c8a7aF309dCF04C
- TaskRegistry: 0x4Dc9dD73834E94545cF041091e1A743FBD09a60f
- GOV Token: 0xB97eDD49C225d2c43e7203aB9248cAbED2B268d3
- COMP Token: 0x24249A523A251E38CB0001daBd54DD44Ea8f1838

`, 'background: #6366f1; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;', '');
