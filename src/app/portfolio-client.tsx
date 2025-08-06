'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Masonry from 'react-masonry-css';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram, FaSun, FaMoon, FaHome } from 'react-icons/fa';


import { PhotoProject, VideoProject } from '../../lib/contentful';

interface PortfolioClientProps {
  photoProjects: PhotoProject[];
  videoProjects: VideoProject[];
}

export default function PortfolioClient({ photoProjects, videoProjects }: PortfolioClientProps) {
  const [view, setView] = useState<'photos' | 'videos'>('photos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [slides, setSlides] = useState<{ src: string; title: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('');

  // New: For floating plus icon
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);


  const openLightbox = (proj: PhotoProject, idx: number) => {
    setSlides(proj.images.map(src => ({ src, title: proj.title })));
    setCurrentIndex(idx);
    setCurrentTitle(proj.title);
    setLightboxOpen(true);
  };

  
  
  const photoItems = photoProjects.flatMap(p =>
    p.images.map((src, i) => ({ src, project: p, index: i }))
  );
  const cols = { default: 4, 1600: 3, 1200: 2, 900: 1 };

  return (
    <div className="bg-white text-black min-h-screen dark:bg-black dark:text-white">
      <header className="sticky top-0 z-50 flex justify-between items-end px-6 pt-20 pb-8 bg-white dark:bg-black max-w-[1600px] mx-auto">
        <div className="text-3xl font-serif tracking-wide">Richard Quintero</div>
        <nav className="space-x-8 text-sm uppercase tracking-wide">
          <button
            onClick={() => setView('photos')}
            className="relative hover:opacity-100 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-black dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full">
            PHOTOGRAPHY
          </button>
          <button
            onClick={() => setView('videos')}
            className="relative hover:opacity-100 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-black dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full">
            VIDEOS
          </button>
        </nav>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pt-8 pb-16">
        {view === 'photos' && (
          <Masonry
            breakpointCols={cols}
            className="flex -ml-4"
            columnClassName="pl-4 flex flex-col gap-4"
          >
            {photoItems.map(({ src, project, index }) => (
              <div
                key={`${project.title}-${index}`}
                className="relative cursor-pointer group animate-fadeIn"
                onClick={() => openLightbox(project, index)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  setHoveredIndex(index);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={src}
                  alt={project.title}
                  width={600}
                  height={800}
                  className="rounded-sm object-cover"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {hoveredIndex === index && (
                    <div
                      className="absolute pointer-events-none transition-all duration-150 ease-out"
                      style={{
                        top: hoverPos.y,
                        left: hoverPos.x,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                        <span className="text-white dark:text-black text-2xl font-bold">+</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 w-full text-center text-white dark:text-black text-sm tracking-wide uppercase">
                    {project.title}
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        )}

        {view === 'videos' && (
          <Masonry
            breakpointCols={cols}
            className="flex -ml-4"
            columnClassName="pl-4 flex flex-col gap-4"
          >
            {videoProjects.map((vid, i) => (
              <div key={i} className="animate-fadeIn">
                <video src={vid.src} poster={vid.poster} controls className="rounded-sm w-full" />
                <div className="mt-2 text-center text-sm font-medium">{vid.title}</div>
              </div>
            ))}
          </Masonry>
        )}
      </main>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={currentIndex}
          on={{
            view: ({ index }) => {
              setCurrentIndex(index);
              if (slides[index]) {
                setCurrentTitle(slides[index].title);
              }
            },
          }}
          plugins={[Thumbnails]}
          controller={{
            closeOnBackdropClick: true,
            closeOnPullDown: true,
          }}
          render={{
            slide: ({ slide }) => (
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-95 text-white py-4 px-8 text-xl font-normal shadow-lg z-40">
                  <span className="text-white">
                    {currentTitle || 'No Title'}
                    <span className="text-sm font-normal ml-2 opacity-80">
                      ({currentIndex + 1}/{slides.length})
                    </span>
                  </span>
                </div>
                <div className="pt-20 flex justify-center items-center h-full">
                  <Image
                    src={slide.src}
                    alt=""
                    width={1200}
                    height={800}
                    className="object-contain max-h-[80vh]"
                  />
                </div>
              </div>
            ),
          }}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>


<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-black/50 backdrop-blur-md shadow-lg border border-neutral-200 dark:border-neutral-800 px-6 py-3 rounded-full flex items-center gap-6 z-50">
<a href="https://github.com" target="_blank" rel="noopener noreferrer">
  <FaGithub className="w-5 h-5 text-black dark:text-white" />
</a>
<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
  <FaLinkedin className="w-5 h-5 text-black dark:text-white" />
</a>
<a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
  <FaYoutube className="w-5 h-5 text-black dark:text-white" />
</a>
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
  <FaInstagram className="w-5 h-5 text-black dark:text-white" />
</a>

<button onClick={() => setIsDark(!isDark)}>
  {isDark ? <FaSun className="w-5 h-5 text-white" /> : <FaMoon className="w-5 h-5 text-black" />}
</button>

</div>

    </div>
  );
}
