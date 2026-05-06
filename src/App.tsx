/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  Youtube, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ArrowUp,
  Star,
  CheckCircle2,
  Mic,
  Headphones,
  ExternalLink,
  X,
  Briefcase,
  History,
  FileText,
  Video,
  Globe
} from 'lucide-react';

// --- Types ---
type Category = 'Writing' | 'News Documentaries' | 'Cultural Documentaries' | 'Audio Reports' | 'Visual Podcast' | 'Podcast' | 'Journal' | 'All';

interface MediaItem {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  source: string;
  date: string;
  thumbnail: string;
  link: string;
}

// --- Data ---
const MEDIA_DATA: MediaItem[] = [
  {
    id: '1',
    title: "The Remi Tinubu era: A critical look at Nigeria's First Lady",
    category: 'Writing',
    source: 'TheCable',
    date: 'June 2024',
    thumbnail: 'https://lh3.googleusercontent.com/d/1ze8odDKFWBa9NLtNNQFwjFaiCEB7WL0Z',
    link: 'https://www.thecable.ng/the-remi-tinubu-era-a-critical-look-at-nigerias-first-lady'
  },
  {
    id: '2',
    title: "End FGM: Dignity, Safety, Freedom",
    category: 'News Documentaries',
    source: 'YouTube',
    date: '2023',
    thumbnail: 'https://img.youtube.com/vi/h5k3iiKr7xo/maxresdefault.jpg',
    link: 'https://youtu.be/h5k3iiKr7xo?si=L0SZIjLnZIogIyNd'
  },
  {
    id: '3',
    title: "Integrating Futures: Rethinking the Almajiri System",
    category: 'News Documentaries',
    source: 'YouTube',
    date: '2022',
    thumbnail: 'https://img.youtube.com/vi/udxF3AtLrR4/maxresdefault.jpg',
    link: 'https://youtu.be/udxF3AtLrR4?si=GQoK8iXULCkCuGf5'
  },
  {
    id: '4',
    title: "AFMED Media Representative: Bridging Stories",
    category: 'Visual Podcast',
    source: 'AFMED',
    date: '2019',
    thumbnail: 'https://img.youtube.com/vi/0HA7Lh_J3Gw/maxresdefault.jpg',
    link: 'https://youtu.be/0HA7Lh_J3Gw?si=oH-kCvjv5ycetysh'
  },
  {
    id: '5',
    title: "Documenting the Unspoken: Social Impact in Media",
    category: 'Cultural Documentaries',
    source: 'YouTube',
    date: '2024',
    thumbnail: 'https://img.youtube.com/vi/_pp1L_d_NFQ/maxresdefault.jpg',
    link: 'https://youtu.be/_pp1L_d_NFQ?si=Re67gmZVpoVyFLI8'
  },
  {
    id: '6',
    title: "Public Relations in the Age of Misinformation",
    category: 'Writing',
    source: 'Medium',
    date: '2024',
    thumbnail: 'https://img.youtube.com/vi/o4w7UukuLuE/maxresdefault.jpg',
    link: 'https://youtu.be/o4w7UukuLuE?si=2p3N4_0vSJQSfh0B'
  },
  {
    id: '7',
    title: "Media Strategy and Political Analysis 2024",
    category: 'Visual Podcast',
    source: 'YouTube',
    date: '2024',
    thumbnail: 'https://img.youtube.com/vi/S4Ne8nq5c64/maxresdefault.jpg',
    link: 'https://youtu.be/S4Ne8nq5c64?si=57M22OQAbvb4P8Z2'
  },
  {
    id: '8',
    title: "Strategic Communications in Modern Nigeria",
    category: 'Visual Podcast',
    source: 'YouTube',
    date: '2024',
    thumbnail: 'https://img.youtube.com/vi/D9penJUWTZo/maxresdefault.jpg',
    link: 'https://youtu.be/D9penJUWTZo?si=p5IOpG6T84oGKUyd'
  }
];

const TIMELINE_DATA = [
  {
    year: '2019',
    title: 'AFMED Media Representative',
    description: 'International media coverage and representation, bridging Nigerian stories to global audiences.',
    icon: Globe
  },
  {
    year: '2021-Present',
    title: 'TheCable Contributor',
    description: 'Specializing in political analysis, social commentary, and high-impact opinion journalism.',
    icon: FileText
  },
  {
    year: '2022-Present',
    title: 'YouTube Documentary Channel',
    description: 'Independent filmmaking focusing on critical social issues including FGM and the Almajiri system.',
    icon: Video
  },
  {
    year: '2023-Present',
    title: 'Media & PR Consultant',
    description: 'Strategic communications, brand management, and digital media strategy for high-profile clients.',
    icon: Briefcase
  }
];

// --- Animation Components ---

const Cursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button, select, input, textarea'));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 bg-brand-emerald rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? 4 : 1,
        opacity: 0.8
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    />
  );
};

const ScrollReveal = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-brand-bg/95 backdrop-blur-md py-4 border-b border-brand-subtle shadow-sm' : 'py-6 md:py-8'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.a 
          href="#home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="group flex items-center gap-3"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 border border-brand-emerald flex items-center justify-center font-serif text-xs md:text-sm text-brand-emerald font-bold group-hover:bg-brand-emerald group-hover:text-white transition-all duration-300">
            FD
          </div>
          <span className="font-serif text-xs md:text-sm tracking-[0.2em] text-brand-text font-bold uppercase hidden sm:block">
            Fatima Dangogo
          </span>
        </motion.a>
        
        <div className="flex gap-2 min-[375px]:gap-4 md:gap-10 text-[7px] min-[375px]:text-[8px] md:text-[10px] uppercase tracking-wider md:tracking-[0.3em] font-bold text-brand-text-secondary">
          {['About', 'Work', 'Timeline', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
          <a href="http://ummydee.blogspot.com" target="_blank" rel="noopener noreferrer" className="nav-link flex items-center gap-1 text-brand-emerald">
            Journal <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  return (
    <section id="home" className="relative h-[100dvh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black px-6">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.15)_0%,transparent_70%)] z-20" />
        <iframe
          className="w-full h-full scale-[1.5] pointer-events-none opacity-60"
          src="https://www.youtube.com/embed/wL4sOBkpm0o?autoplay=1&mute=1&loop=1&playlist=wL4sOBkpm0o&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
      
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-30 text-center max-w-4xl mx-auto"
      >
        <motion.h1 
          variants={itemVars}
          className="text-5xl md:text-8xl font-serif font-bold tracking-tighter mb-6 uppercase leading-[0.9] text-white"
        >
          Fatima Dangogo
        </motion.h1>
        
        <motion.p 
          variants={itemVars}
          className="text-sm md:text-xl text-brand-emerald tracking-[0.2em] md:tracking-widest uppercase mb-4 font-bold"
        >
          Journalist. Media Strategist. Documentary Storyteller.
        </motion.p>
        
        <motion.p 
          variants={itemVars}
          className="text-white/70 max-w-md mx-auto mb-10 text-xs md:text-base italic leading-relaxed"
        >
          "Amplifying voices through journalism, PR, and documentary filmmaking."
        </motion.p>
        
        <motion.div variants={itemVars}>
          <a href="#work" className="cta-primary inline-block !bg-brand-emerald !text-white !border-brand-emerald hover:!bg-transparent">
            View Portfolio
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Skills = () => {
  const coreSkills = [
    { name: "Journalism & Reporting", rating: 5 },
    { name: "Media Strategy & PR", rating: 5 },
    { name: "Documentary Filmmaking", rating: 4 },
    { name: "Political Analysis", rating: 4 },
    { name: "Content Development", rating: 5 },
  ];

  const specialties = [
    { name: "PR", percent: 100, label: "First" },
    { name: "Journalism", percent: 85, label: "Second" },
    { name: "Filming", percent: 75, label: "Third" },
    { name: "Impact", percent: 90, label: "Fourth" },
  ];

  const languages = [
    { name: "English", level: 100 },
    { name: "Hausa", level: 100 },
    { name: "French", level: 40 },
    { name: "Arabic", level: 60 },
  ];

  return (
    <section id="skills" className="section-padding bg-brand-surface/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <SectionLabel>Expertise</SectionLabel>
            <h3 className="text-3xl md:text-4xl font-serif font-bold">Skills & Specialities</h3>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-16 md:gap-24">
          {/* Core Skills - Star Ratings */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-brand-emerald font-bold mb-8">Core Skills</h4>
              <div className="space-y-6">
                {coreSkills.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm font-bold text-brand-text">{skill.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={14} 
                          fill={s <= skill.rating ? "currentColor" : "none"} 
                          className={s <= skill.rating ? "text-brand-emerald" : "text-brand-subtle"}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Specialities - Circular Progress */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-brand-emerald font-bold mb-8">My Specialities</h4>
              <div className="grid grid-cols-2 gap-8">
                {specialties.map((spec) => (
                  <div key={spec.name} className="flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="38%"
                          className="stroke-brand-subtle fill-none"
                          strokeWidth="2"
                        />
                        <motion.circle
                          cx="50%"
                          cy="50%"
                          r="38%"
                          className="stroke-brand-emerald fill-none"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                          initial={{ strokeDashoffset: 100 }}
                          whileInView={{ strokeDashoffset: 100 - spec.percent }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm md:text-lg font-serif font-bold">{spec.percent}%</span>
                        <span className="text-[8px] uppercase tracking-tighter text-brand-text-secondary">{spec.label}</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-text-secondary">{spec.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Languages - Progress Bars */}
          <ScrollReveal delay={0.3}>
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-brand-emerald font-bold mb-8">Languages</h4>
              <div className="space-y-8">
                {languages.map((lang) => (
                  <div key={lang.name} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-brand-text">{lang.name}</span>
                    </div>
                    <div className="h-[2px] w-full bg-brand-subtle relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 bg-brand-emerald"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="section-padding bg-brand-bg relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <ScrollReveal>
            <div className="max-w-xl">
              <SectionLabel>About Fatima</SectionLabel>
              <h3 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 leading-tight font-bold">
                Bridging Traditional Journalism with Digital Media Strategy
              </h3>
              <div className="space-y-6 text-brand-text-secondary leading-relaxed text-base md:text-lg">
                <p>
                  Fatima Dangogo is a Nigerian journalist, media consultant, and documentary filmmaker. 
                  A contributor to TheCable, one of Nigeria's leading independent news platforms, she specializes 
                  in political analysis, social commentary, and in-depth storytelling.
                </p>
                <p>
                  Through her YouTube channel, she produces documentary content addressing critical social issues 
                  including female genital mutilation, the Almajiri education system, and women's rights. 
                </p>
                <p>
                  With a background in media and public relations, Fatima creates content that informs, 
                  challenges, and inspires action, leveraging her unique position at the intersection of media and advocacy.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-8 items-center border-t border-brand-subtle pt-8">
                {[
                  "5+ Years in Media",
                  "TheCable Contributor",
                  "Documentary Filmmaker",
                  "PR Consultant"
                ].map((stat, i) => (
                  <div key={stat} className="flex items-center gap-3 md:gap-4">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-brand-text-secondary font-bold">{stat}</span>
                    {i < 3 && <div className="hidden md:block h-4 w-px bg-brand-emerald/30" />}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="relative group aspect-square max-w-lg mx-auto lg:ml-auto">
              <div className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/d/1c1UJthGt-8DK3DPppT117oXqw4T0MaYQ" 
                  alt="Fatima Dangogo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover border border-brand-subtle transition-transform duration-1000 group-hover:scale-[1.05]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-full h-full border-2 border-brand-emerald/10 -z-10 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const categories: Category[] = ['Writing', 'News Documentaries', 'Cultural Documentaries', 'Audio Reports', 'Visual Podcast', 'Podcast', 'Journal'];
  const [filter, setFilter] = useState<Category>('Writing');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  const filteredItems = MEDIA_DATA.filter(item => item.category === filter);

  const isPlaceholderCategory = filter === 'Podcast' || filter === 'Audio Reports';

  return (
    <section id="work" className="section-padding bg-brand-surface/20">
      <ProjectModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal>
          <div className="flex flex-col mb-12 md:mb-16 gap-8">
            <div>
              <SectionLabel>Portfolio</SectionLabel>
              <h3 className="text-3xl md:text-4xl font-serif font-bold">Media Gallery</h3>
            </div>
            
            <div className="flex overflow-x-auto pb-4 md:pb-2 gap-3 md:gap-4 no-scrollbar border-b border-brand-subtle">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[9px] md:text-[10px] uppercase tracking-widest pb-4 transition-all duration-300 font-bold whitespace-nowrap border-b-2 ${
                    filter === cat 
                      ? 'border-brand-emerald text-brand-emerald' 
                      : 'border-transparent text-brand-text-secondary/60 hover:text-brand-text-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {filter === 'Journal' ? (
              <motion.div
                key="journal-redirect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-xl mx-auto text-center py-20 glass-card"
              >
                <div className="w-16 h-16 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ExternalLink size={32} className="text-brand-emerald" />
                </div>
                <h4 className="text-2xl font-serif font-bold mb-4">Read My Journal</h4>
                <p className="text-brand-text-secondary mb-8">Exploring deeper narratives and personal reflections on my Blogspot.</p>
                <a 
                  href="http://ummydee.blogspot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cta-primary inline-flex items-center gap-2"
                >
                  Visit Blogspot <ExternalLink size={14} />
                </a>
              </motion.div>
            ) : isPlaceholderCategory ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-xl mx-auto text-center py-20 glass-card border-dashed"
              >
                <div className="w-16 h-16 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {filter === 'Podcast' ? <Mic size={32} className="text-brand-emerald" /> : <Headphones size={32} className="text-brand-emerald" />}
                </div>
                <h4 className="text-2xl font-serif font-bold mb-4">Coming Soon</h4>
                <p className="text-brand-text-secondary">Content arriving end of month</p>
              </motion.div>
            ) : filteredItems.length > 0 ? (
              <motion.div 
                key={filter}
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group glass-card overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-emerald/90 text-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
                          <ExternalLink size={20} />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-brand-bg/80 backdrop-blur-sm text-brand-emerald text-[8px] uppercase tracking-widest px-2 py-1 rounded-sm border border-brand-emerald/20 font-bold">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                      <span className="text-[10px] text-brand-text-secondary/60 block mb-2 font-medium">{item.source} • {item.date}</span>
                      <h4 className="text-lg font-bold group-hover:text-brand-emerald transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <button className="inline-block mt-4 text-[10px] uppercase tracking-widest text-brand-emerald border-b border-brand-emerald/0 hover:border-brand-emerald transition-all font-bold">
                        Explore Project
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-brand-text-secondary italic">No items found in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <ScrollReveal>
          <div className="mt-16 text-center">
            <button className="cta-primary min-w-[200px] opacity-50 cursor-not-allowed">
              End of Portfolio
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Timeline = () => {
  return (
    <section id="timeline" className="section-padding max-w-[1400px] mx-auto px-6 md:px-12">
      <ScrollReveal>
        <div className="text-center mb-16 md:mb-20">
          <SectionLabel>Chronology</SectionLabel>
          <h3 className="text-3xl md:text-4xl font-serif font-bold">Career Path</h3>
        </div>
      </ScrollReveal>
      
      <div className="relative">
        {/* Continuous Line */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-brand-emerald/20" />
        
        <div className="space-y-12 md:space-y-0">
          {TIMELINE_DATA.map((item, index) => (
            <div 
              key={item.year}
              className={`flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Content Panel */}
              <div className="w-full md:w-1/2 pl-12 md:px-12 mb-0 md:mb-0">
                <ScrollReveal delay={index * 0.1}>
                  <div className={`p-6 md:p-8 glass-card w-full max-w-lg ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hover:border-brand-emerald/30 transition-colors duration-500`}>
                    <span className="text-xl md:text-2xl font-serif text-brand-emerald block mb-2 font-bold">{item.year}</span>
                    <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{item.title}</h4>
                    <p className="text-brand-text-secondary text-xs md:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </ScrollReveal>
              </div>
              
              {/* Timeline Node */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex justify-center items-center h-full">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-bg md:bg-brand-bg border border-brand-emerald flex items-center justify-center relative z-10 shadow-lg"
                >
                  <item.icon size={18} className="text-brand-emerald" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: [0, 1, 0], scale: [1, 2.5, 1] }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="absolute inset-0 rounded-full bg-brand-emerald/20"
                  />
                </motion.div>
              </div>
              
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding bg-brand-surface/30">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <SectionLabel>Inquiry</SectionLabel>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-brand-text-primary">Get In Touch</h3>
            <p className="text-sm md:text-base text-brand-text-secondary">For media inquiries, collaborations, or speaking engagements.</p>
          </div>
        
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Your Name" className="input-field" required />
                  <input type="email" placeholder="Your Email" className="input-field" required />
                </div>
                <div className="relative">
                  <select className="input-field appearance-none" required>
                    <option value="">Select Subject</option>
                    <option value="media">Media Inquiry</option>
                    <option value="collab">Collaboration</option>
                    <option value="speaking">Speaking Request</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-secondary/50">
                    <ArrowUp className="rotate-180" size={14} />
                  </div>
                </div>
                <textarea placeholder="Your Message" rows={5} className="input-field" required />
                <button 
                  disabled={isSubmitting}
                  className="cta-primary w-full h-14 flex items-center justify-center font-bold relative overflow-hidden group"
                >
                  <span className={isSubmitting ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  {isSubmitting && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-center py-16 px-8 border border-brand-subtle glass-card bg-brand-bg select-none"
              >
                <div className="w-20 h-20 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-emerald/20">
                  <CheckCircle2 size={40} className="text-brand-emerald" />
                </div>
                <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4">Message Sent</h4>
                <p className="text-brand-text-secondary max-w-sm mx-auto mb-10">
                  Thank you for reaching out. Fatima's team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-emerald border-b border-brand-emerald/40 hover:border-brand-emerald transition-all"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <div className="mt-20 border-t border-brand-subtle pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-brand-text-secondary mb-2 font-bold">Direct Contact</p>
              <a href="mailto:hello@fatimadangogo.com" className="text-lg md:text-xl font-serif hover:text-brand-emerald transition-colors font-bold break-all md:break-normal">
                hello@fatimadangogo.com
              </a>
            </div>
            
            <div className="flex gap-6">
              {[
                { icon: Youtube, label: 'YouTube' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' }
              ].map((social) => (
                <a 
                  key={social.label}
                  href="#" 
                  className="text-brand-text-secondary hover:text-brand-emerald transition-all hover:-translate-y-2"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <footer className="py-12 border-t border-brand-subtle bg-brand-bg">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border border-brand-emerald/30 flex items-center justify-center font-serif text-sm text-brand-emerald/60 font-bold">
            FD
          </div>
          <p className="text-xs text-brand-text-secondary/60 font-medium">
            © {new Date().getFullYear()} Fatima Dangogo. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-8 text-[10px] uppercase tracking-widest text-brand-text-secondary/60 font-bold">
          <a href="#" className="hover:text-brand-emerald transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand-emerald transition-colors">Terms</a>
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0 })}
            className="fixed bottom-8 right-8 w-10 h-10 border border-brand-emerald text-brand-emerald flex items-center justify-center hover:bg-brand-emerald hover:text-white transition-all z-[90] backdrop-blur-sm bg-brand-bg/50"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

// Custom layout primitives
const ProjectModal = ({ item, isOpen, onClose }: { item: MediaItem | null, isOpen: boolean, onClose: () => void }) => {
  if (!item) return null;

  const isVideo = item.source.toLowerCase() === 'youtube' || item.source.toLowerCase() === 'afmed';
  
  // Extract YouTube ID
  let videoId = '';
  if (isVideo) {
    const match = item.link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    videoId = match ? match[1] : '';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-brand-bg border border-brand-subtle shadow-2xl overflow-hidden glass-card !bg-opacity-100"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-brand-emerald transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col">
              {/* Media Area */}
              <div className="aspect-video w-full bg-black">
                {isVideo && videoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-50 contrast-125"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                         <div className="w-16 h-16 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-emerald/20">
                            <ExternalLink size={32} className="text-brand-emerald" />
                         </div>
                         <p className="text-white font-bold tracking-widest text-xs uppercase">External Article</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-brand-emerald/10 text-brand-emerald font-bold rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-brand-text-secondary uppercase tracking-widest font-medium">
                    {item.source} • {item.date}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 leading-tight">
                  {item.title}
                </h3>
                
                <div className="flex gap-4">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cta-primary inline-flex items-center gap-2"
                  >
                    {isVideo ? 'Watch on YouTube' : 'Read Full Article'} <ExternalLink size={14} />
                  </a>
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 border border-brand-subtle text-[10px] uppercase tracking-widest font-bold hover:bg-brand-surface transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[10px] uppercase tracking-[0.4em] text-brand-text-secondary mb-4 block font-bold">
    {children}
  </span>
);

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-emerald selection:text-white bg-brand-bg md:cursor-none overflow-x-hidden">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Gallery />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// Add these to index.css if they were used as classes (I used tailwind equivalents in JS but defined them here for consistency)
/**
.text-small-label {
  @apply text-[10px] uppercase tracking-[0.4em] text-brand-text-secondary mb-4 block font-medium;
}
**/
