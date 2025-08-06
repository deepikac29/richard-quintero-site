'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Masonry from 'react-masonry-css';
import TestComponent from './test';
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

  const openLightbox = (proj: PhotoProject, idx: number) => {
    console.log('Opening lightbox for project:', proj.title);
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
    <div className="bg-white text-black min-h-screen">
      <header className="sticky top-0 z-50 flex justify-between items-end px-6 pt-20 bg-white max-w-[1600px] mx-auto">
        <div className="text-3xl font-serif tracking-wide">Richard Quintero</div>
        <nav className="space-x-8 text-sm uppercase tracking-wide">
          <button onClick={() => setView('photos')} className="hover:opacity-60">
            PHOTOGRAPHY
          </button>
          <button onClick={() => setView('videos')} className="hover:opacity-60">
            VIDEOS
          </button>
        </nav>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pt-16">
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
              >
                <Image
                  src={src}
                  alt={project.title}
                  width={600}
                  height={800}
                  className="rounded-sm object-cover"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">+</span>
                  </div>
                  <span className="text-white text-sm tracking-wide">{project.title}</span>
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
            closeOnEsc: true,
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
    </div>
  );
}
