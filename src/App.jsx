/**
 * Galaxy Portfolio — Main Application
 *
 * A stunning 3D interactive portfolio with:
 * - Galaxy-themed background with parallax
 * - Neumorphic UI design system
 * - Three.js 3D scene with interactive elements
 * - Responsive layout for all devices
 * - Performance-optimized rendering
 * - Accessibility features
 */

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalaxyBackground from './components/Background/GalaxyBackground';
import NeuMenu from './components/UI/NeuMenu';
import NeuButton from './components/UI/NeuButton';
import NeuCard, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/UI/NeuCard';
import Section, { SectionHeader } from './components/Layout/Section';
import './styles/global.css';
import './styles/neumorphic.css';

// Lazy load 3D scene for performance
const Portfolio3D = lazy(() => import('./components/Scene/Portfolio3D'));

// Navigation items
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '👨‍💻' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'contact', label: 'Contact', icon: '📬' },
];

// Sample projects data
const PROJECTS = [
  {
    id: 1,
    title: 'Galaxy Explorer',
    description: 'An interactive 3D space exploration game built with Three.js and WebGL. Features real-time physics, procedural galaxy generation, and multiplayer support.',
    shortDescription: 'Interactive 3D space game',
    tech: ['Three.js', 'WebGL', 'Socket.io', 'React'],
    color: '#7c3aed',
    github: 'https://github.com',
    demo: 'https://example.com',
  },
  {
    id: 2,
    title: 'Neural Canvas',
    description: 'AI-powered creative tool that generates art using neural style transfer and GANs. Real-time preview and export capabilities.',
    shortDescription: 'AI art generation platform',
    tech: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    color: '#06b6d4',
    github: 'https://github.com',
    demo: 'https://example.com',
  },
  {
    id: 3,
    title: 'Quantum Dashboard',
    description: 'Real-time data visualization dashboard with quantum computing metrics, interactive charts, and predictive analytics.',
    shortDescription: 'Data visualization dashboard',
    tech: ['D3.js', 'React', 'Node.js', 'PostgreSQL'],
    color: '#f472b6',
    github: 'https://github.com',
    demo: 'https://example.com',
  },
  {
    id: 4,
    title: 'Nebula API',
    description: 'High-performance REST API framework with automatic documentation, rate limiting, and GraphQL support.',
    shortDescription: 'Modern API framework',
    tech: ['Node.js', 'Express', 'GraphQL', 'Redis'],
    color: '#818cf8',
    github: 'https://github.com',
    demo: 'https://example.com',
  },
];

// Skills data
const SKILLS = [
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'Three.js', level: 88, category: '3D' },
  { name: 'JavaScript', level: 92, category: 'Language' },
  { name: 'TypeScript', level: 85, category: 'Language' },
  { name: 'Node.js', level: 88, category: 'Backend' },
  { name: 'Python', level: 82, category: 'Language' },
  { name: 'WebGL', level: 78, category: '3D' },
  { name: 'CSS/SASS', level: 90, category: 'Frontend' },
];

// Project modal component
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      className="project-modal__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="project-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className="project-modal__close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="project-modal__header" style={{ borderColor: project.color }}>
          <h2 id="modal-title" className="project-modal__title">{project.title}</h2>
          <p className="project-modal__description">{project.description}</p>
        </div>

        <div className="project-modal__tech">
          {project.tech.map((tech) => (
            <span key={tech} className="project-modal__tech-badge">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-modal__actions">
          <NeuButton
            variant="primary"
            onClick={() => window.open(project.demo, '_blank')}
          >
            Live Demo
          </NeuButton>
          <NeuButton
            variant="ghost"
            onClick={() => window.open(project.github, '_blank')}
          >
            View Code
          </NeuButton>
        </div>
      </motion.div>

      <style>{`
        .project-modal__overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .project-modal {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 32px;
          max-width: 600px;
          width: 100%;
          position: relative;
          box-shadow:
            20px 20px 40px rgba(0, 0, 0, 0.5),
            -20px -20px 40px rgba(124, 58, 237, 0.1);
        }

        .project-modal__close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }

        .project-modal__close:hover {
          color: var(--text-primary);
          background: rgba(124, 58, 237, 0.1);
        }

        .project-modal__header {
          border-left: 3px solid;
          padding-left: 16px;
          margin-bottom: 24px;
        }

        .project-modal__title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .project-modal__description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .project-modal__tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .project-modal__tech-badge {
          padding: 6px 12px;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 9999px;
          font-size: 0.8rem;
          color: var(--accent-primary);
        }

        .project-modal__actions {
          display: flex;
          gap: 12px;
        }
      `}</style>
    </motion.div>
  );
};

// Skill bar component
const SkillBar = ({ name, level, category }) => (
  <div className="skill-bar">
    <div className="skill-bar__header">
      <span className="skill-bar__name">{name}</span>
      <span className="skill-bar__level">{level}%</span>
    </div>
    <div className="skill-bar__track">
      <motion.div
        className="skill-bar__fill"
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
    <span className="skill-bar__category">{category}</span>

    <style>{`
      .skill-bar {
        padding: 16px;
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        box-shadow:
          6px 6px 12px var(--neu-shadow-dark),
          -6px -6px 12px var(--neu-shadow-light);
      }

      .skill-bar__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .skill-bar__name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .skill-bar__level {
        color: var(--accent-primary);
        font-weight: 600;
      }

      .skill-bar__track {
        height: 8px;
        background: var(--bg-secondary);
        border-radius: 9999px;
        overflow: hidden;
        box-shadow:
          inset 2px 2px 4px var(--neu-shadow-inset-dark),
          inset -2px -2px 4px var(--neu-shadow-inset-light);
      }

      .skill-bar__fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        border-radius: 9999px;
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
      }

      .skill-bar__category {
        display: inline-block;
        margin-top: 8px;
        font-size: 0.75rem;
        color: var(--text-muted);
      }
    `}</style>
  </div>
);

// Main App component
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle navigation
  const handleNavigate = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  // Observe sections for active state
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="app">
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-screen__content">
              <motion.div
                className="loading-screen__logo"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                ✦
              </motion.div>
              <p>Loading Galaxy...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Galaxy background */}
      <GalaxyBackground />

      {/* Navigation */}
      <NeuMenu
        items={NAV_ITEMS}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main content */}
      <main id="main-content">
        {/* Hero Section */}
        <Section id="home" variant="fullHeight" withGlow>
          <div className="hero">
            <div className="hero__content">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="hero__badge">Welcome to my universe</span>
              </motion.div>

              <motion.h1
                className="hero__title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Crafting Digital
                <br />
                <span className="hero__title-accent">Experiences</span>
              </motion.h1>

              <motion.p
                className="hero__description"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Full-stack developer & creative technologist specializing in
                immersive 3D web experiences, interactive interfaces, and
                cutting-edge digital solutions.
              </motion.p>

              <motion.div
                className="hero__actions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <NeuButton
                  variant="primary"
                  size="lg"
                  onClick={() => handleNavigate('projects')}
                >
                  View Projects
                </NeuButton>
                <NeuButton
                  variant="ghost"
                  size="lg"
                  onClick={() => handleNavigate('contact')}
                >
                  Get in Touch
                </NeuButton>
              </motion.div>
            </div>

            <div className="hero__scene">
              <Suspense fallback={
                <div className="hero__scene-loader">
                  Loading 3D Scene...
                </div>
              }>
                <Portfolio3D
                  projects={PROJECTS}
                  onProjectClick={setSelectedProject}
                />
              </Suspense>
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section id="about" delay={0.1}>
          <SectionHeader
            badge="About Me"
            title="Passionate Developer & Creator"
            description="Combining technical expertise with creative vision to build memorable digital experiences."
          />

          <div className="about-grid">
            <NeuCard variant="glow" glowColor="#7c3aed">
              <CardHeader>
                <CardTitle>🎯 Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  To push the boundaries of web technology and create immersive
                  experiences that inspire and engage users. I believe in the power
                  of code to transform ideas into reality.
                </CardDescription>
              </CardContent>
            </NeuCard>

            <NeuCard variant="glow" glowColor="#06b6d4">
              <CardHeader>
                <CardTitle>💡 Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  I combine clean code principles with cutting-edge technologies.
                  Every project is an opportunity to learn, innovate, and deliver
                  exceptional results that exceed expectations.
                </CardDescription>
              </CardContent>
            </NeuCard>

            <NeuCard variant="glow" glowColor="#f472b6">
              <CardHeader>
                <CardTitle>🌟 Values</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quality over quantity, user-centric design, and continuous
                  improvement. I'm committed to writing maintainable code and
                  creating accessible experiences for everyone.
                </CardDescription>
              </CardContent>
            </NeuCard>
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects" delay={0.2}>
          <SectionHeader
            badge="Portfolio"
            title="Featured Projects"
            description="Explore my latest work showcasing innovative solutions and creative implementations."
          />

          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NeuCard
                  hoverable
                  glowColor={project.color}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader>
                    <div className="project-card__header">
                      <CardTitle>{project.title}</CardTitle>
                      <span
                        className="project-card__dot"
                        style={{ background: project.color }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{project.description}</CardDescription>
                    <div className="project-card__tech">
                      {project.tech.map((tech) => (
                        <span key={tech} className="project-card__tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <NeuButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.demo, '_blank');
                      }}
                    >
                      Demo
                    </NeuButton>
                    <NeuButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, '_blank');
                      }}
                    >
                      Code
                    </NeuButton>
                  </CardFooter>
                </NeuCard>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Skills Section */}
        <Section id="skills" variant="centered" delay={0.3}>
          <SectionHeader
            badge="Expertise"
            title="Skills & Technologies"
            description="A snapshot of my technical proficiencies and areas of expertise."
          />

          <div className="skills-grid">
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" variant="centered" delay={0.4}>
          <SectionHeader
            badge="Connect"
            title="Let's Work Together"
            description="Have a project in mind? I'd love to hear about it. Let's create something amazing."
          />

          <NeuCard variant="glow" className="contact-card">
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <h4>Email</h4>
                    <a href="mailto:hello@example.com">hello@example.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div>
                    <h4>Social</h4>
                    <div className="contact-socials">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <h4>Location</h4>
                    <p>Available for remote work worldwide</p>
                  </div>
                </div>
              </div>

              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="neu-input"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="neu-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    className="neu-input"
                    rows={4}
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>

                <NeuButton type="submit" variant="primary" fullWidth>
                  Send Message
                </NeuButton>
              </form>
            </div>
          </NeuCard>
        </Section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__content">
          <p className="footer__text">
            © {new Date().getFullYear()} Galaxy Portfolio. Crafted with ✦ and Three.js
          </p>
          <div className="footer__links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* Loading Screen */
        .loading-screen {
          position: fixed;
          inset: 0;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-screen__content {
          text-align: center;
        }

        .loading-screen__logo {
          font-size: 3rem;
          color: var(--accent-primary);
          margin-bottom: 16px;
        }

        .loading-screen__content p {
          color: var(--text-secondary);
          font-family: var(--font-display);
        }

        /* Hero */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 100vh;
          padding-top: 80px;
        }

        .hero__content {
          max-width: 600px;
        }

        .hero__badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 20px;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 9999px;
          font-size: 0.85rem;
          color: var(--accent-primary);
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }

        .hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
          line-height: 1.1;
        }

        .hero__title-accent {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero__description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero__actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero__scene {
          position: relative;
          height: 600px;
        }

        .hero__scene-loader {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-secondary);
          font-family: var(--font-display);
        }

        /* About Grid */
        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .project-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .project-card__dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }

        .project-card__tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .project-card__tech-badge {
          padding: 4px 10px;
          background: rgba(124, 58, 237, 0.1);
          border-radius: 9999px;
          font-size: 0.75rem;
          color: var(--accent-primary);
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          max-width: 900px;
          width: 100%;
        }

        /* Contact */
        .contact-card {
          max-width: 1000px;
          width: 100%;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .contact-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .contact-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(124, 58, 237, 0.1);
          border-radius: 12px;
        }

        .contact-item h4 {
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .contact-item a,
        .contact-item p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .contact-item a:hover {
          color: var(--accent-primary);
        }

        .contact-socials {
          display: flex;
          gap: 16px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        textarea.neu-input {
          resize: vertical;
          min-height: 120px;
        }

        /* Footer */
        .footer {
          padding: 32px 24px;
          border-top: 1px solid var(--bg-tertiary);
        }

        .footer__content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer__text {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer__links {
          display: flex;
          gap: 24px;
        }

        .footer__links a {
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: color var(--transition-fast);
        }

        .footer__links a:hover {
          color: var(--accent-primary);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero__content {
            max-width: 100%;
          }

          .hero__actions {
            justify-content: center;
          }

          .hero__scene {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .contact-content {
            grid-template-columns: 1fr;
          }

          .footer__content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
