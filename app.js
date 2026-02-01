/**
 * Personal Portfolio Website
 * Object-Oriented JavaScript Architecture
 */

// ============================================
// Base Classes
// ============================================

/**
 * Component Base Class
 * All UI components inherit from this
 */
class Component {
    constructor(element) {
        this.element = element;
    }

    render() {
        throw new Error('render() must be implemented by subclass');
    }

    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
        }
    }
}

/**
 * Data Model Base Class
 */
class Model {
    constructor(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }
}

// ============================================
// Models
// ============================================

/**
 * Skill Model
 */
class Skill extends Model {
    constructor(name, description, icon) {
        super({ name, description, icon });
    }

    toHTML() {
        return `
            <div class="skill-card fade-in">
                <div class="skill-icon">${this.data.icon}</div>
                <h3 class="skill-name">${this.data.name}</h3>
                <p class="skill-description">${this.data.description}</p>
            </div>
        `;
    }
}

/**
 * Portfolio Item Model
 */
class PortfolioItem extends Model {
    constructor(title, description, tags, image) {
        super({ title, description, tags, image });
    }

    toHTML() {
        const tagsHTML = this.data.tags.map(tag => 
            `<span class="portfolio-tag">${tag}</span>`
        ).join('');

        return `
            <div class="portfolio-item fade-in">
                <div class="portfolio-image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                </div>
                <div class="portfolio-content">
                    <h3 class="portfolio-title">${this.data.title}</h3>
                    <p class="portfolio-description">${this.data.description}</p>
                    <div class="portfolio-tags">${tagsHTML}</div>
                </div>
            </div>
        `;
    }
}

/**
 * Timeline Item Model
 */
class TimelineItem extends Model {
    constructor(date, title, company, description) {
        super({ date, title, company, description });
    }

    toHTML() {
        return `
            <div class="timeline-item slide-in-left">
                <div class="timeline-date">${this.data.date}</div>
                <h3 class="timeline-title">${this.data.title}</h3>
                <div class="timeline-company">${this.data.company}</div>
                <p class="timeline-description">${this.data.description}</p>
            </div>
        `;
    }
}

// ============================================
// Components
// ============================================

/**
 * Navigation Component
 */
class Navigation extends Component {
    constructor() {
        super(document.getElementById('navbar'));
        this.toggle = document.getElementById('navToggle');
        this.menu = document.getElementById('navMenu');
        this.links = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupToggle();
        this.setupScroll();
        this.setupLinks();
    }

    setupToggle() {
        this.toggle.addEventListener('click', () => {
            this.menu.classList.toggle('active');
        });
    }

    setupScroll() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                this.element.style.transform = 'translateY(0)';
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scroll down
                this.element.style.transform = 'translateY(-100%)';
            } else {
                // Scroll up
                this.element.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    setupLinks() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    this.menu.classList.remove('active');
                }
            });
        });
    }
}

/**
 * Skills Grid Component
 */
class SkillsGrid extends Component {
    constructor(skills) {
        super(document.getElementById('skillsGrid'));
        this.skills = skills;
        this.render();
    }

    render() {
        const skillsHTML = this.skills.map(skill => skill.toHTML()).join('');
        this.element.innerHTML = skillsHTML;
        this.animateOnScroll();
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        this.element.querySelectorAll('.skill-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
}

/**
 * Portfolio Grid Component
 */
class PortfolioGrid extends Component {
    constructor(items) {
        super(document.getElementById('portfolioGrid'));
        this.items = items;
        this.render();
    }

    render() {
        const itemsHTML = this.items.map(item => item.toHTML()).join('');
        this.element.innerHTML = itemsHTML;
        this.animateOnScroll();
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.1 });

        this.element.querySelectorAll('.portfolio-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }
}

/**
 * Timeline Component
 */
class Timeline extends Component {
    constructor(items) {
        super(document.getElementById('timeline'));
        this.items = items;
        this.render();
    }

    render() {
        const itemsHTML = this.items.map(item => item.toHTML()).join('');
        this.element.innerHTML = itemsHTML;
        this.animateOnScroll();
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });

        this.element.querySelectorAll('.timeline-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }
}

/**
 * Contact Form Component
 */
class ContactForm extends Component {
    constructor() {
        super(document.getElementById('contactForm'));
        this.init();
    }

    init() {
        this.element.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Here you would normally send the data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        this.showMessage('Thank you! Your message has been sent.', 'success');
        
        // Reset form
        this.element.reset();
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 6px;
            background: ${type === 'success' ? '#C17B5F' : '#E57373'};
            color: white;
            animation: fadeIn 0.3s ease;
        `;
        
        this.element.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

/**
 * Scroll Animations Handler
 */
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
}

// ============================================
// Application Controller
// ============================================

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize navigation
        new Navigation();

        // Initialize skills section
        const skills = this.getSkillsData();
        new SkillsGrid(skills);

        // Initialize portfolio section
        const portfolioItems = this.getPortfolioData();
        new PortfolioGrid(portfolioItems);

        // Initialize timeline section
        const timelineItems = this.getTimelineData();
        new Timeline(timelineItems);

        // Initialize contact form
        new ContactForm();

        // Initialize scroll animations
        new ScrollAnimations();
    }

    getSkillsData() {
        return [
            new Skill(
                'Frontend Development',
                'Creating responsive and interactive user interfaces using modern web technologies like HTML5, CSS3, and JavaScript.',
                '🎨'
            ),
            new Skill(
                'Backend Development',
                'Building robust server-side applications and RESTful APIs using Node.js, Python, and various databases.',
                '⚙️'
            ),
            new Skill(
                'UI/UX Design',
                'Designing intuitive and beautiful user experiences with tools like Figma, Adobe XD, and Sketch.',
                '✨'
            ),
            new Skill(
                'Mobile Development',
                'Developing cross-platform mobile applications using React Native and Flutter frameworks.',
                '📱'
            ),
            new Skill(
                'DevOps & Cloud',
                'Deploying and managing applications on cloud platforms like AWS, Azure, and Google Cloud.',
                '☁️'
            ),
            new Skill(
                'Database Management',
                'Designing and optimizing databases using SQL, MongoDB, and PostgreSQL for scalable applications.',
                '💾'
            )
        ];
    }

    getPortfolioData() {
        return [
            new PortfolioItem(
                'Yeditepe Chaos Theory Researcher',
                'A research paper exploring non-linear forecasting techniques and mathematical and statistical modelling for Air Pollution.',
                ['Python', 'Pandas', 'NumPy'],
                null
            ),
            new PortfolioItem(
                'ML Stock Price Predictor',
                'A machine learning model that predicts stock prices using historical data and technical indicators.',
                ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
                null
            ),
            new PortfolioItem(
                'Weathify',
                'A music recommendation web app that suggests songs based on current weather conditions using geolocation and weather APIs.',
                ['HTML', 'CSS', 'PHP', 'MySQL', 'Geolocation API, OpenWeatherMap API'],
                null
            ),
            new PortfolioItem(
                'Weathify',
                'A music recommendation web app that suggests songs based on current weather conditions using geolocation and weather APIs.',
                ['HTML', 'CSS', 'PHP', 'MySQL', 'Geolocation API, OpenWeatherMap API'],
                null
            ),
            new PortfolioItem(
                'Social Media App',
                'A social networking platform with photo sharing, messaging, and content discovery features.',
                ['React Native', 'Node.js', 'PostgreSQL'],
                null
            ),
            new PortfolioItem(
                'Analytics Dashboard',
                'A comprehensive analytics dashboard with real-time data visualization and reporting capabilities.',
                ['Angular', 'D3.js', 'Express', 'MySQL'],
                null
            )
        ];
    }

    getTimelineData() {
        return [
            new TimelineItem(
                '2025 - Present',
                'Control Junior Engineer',
                'Manchester Stinger Motorsports',
                'Autonomous Systems Developer focusing on control systems for autonomous racing at Formula Student. Responsible for developing algorithms and software to enhance vehicle performance and safety.'
            ),
            new TimelineItem(
                '2025 - 2028',
                'Bachelor (Hons) of Computer Science & Mathematics',
                'University of Manchester',
                'Expected First Class Honours. Relevant modules focused on Mathematical modelling, statistics, probability and software engineering.'
            ),
            new TimelineItem(
                '2024 - 2025',
                'Researcher',
                'Yeditepe University',
                'Conducted research on chaos theory and its applications in non-linear forecasting techniques. Published a paper on Air Pollution forecasting using mathematical and statistical modelling.'
            ),
            new TimelineItem(
                '2024 - 2024',
                'Software Engineering Intern',
                'BASARSOFT',
                'Facilitated large-scale GIS data validation for city-scale mapping projects covering 21 million door number. Developed internal tools to streamline data processing and improve accuracy.'
            )
        ];
    }
}

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// ============================================
// Utility Functions
// ============================================

/**
 * Smooth scroll utility
 */
function smoothScroll(target, duration = 1000) {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - 80;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

/**
 * Debounce utility for performance
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Component,
        Model,
        Skill,
        PortfolioItem,
        TimelineItem,
        Navigation,
        SkillsGrid,
        PortfolioGrid,
        Timeline,
        ContactForm,
        PortfolioApp
    };
}
