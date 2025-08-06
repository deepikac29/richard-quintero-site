// lib/contentful.ts
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export type PhotoProject = {
  title: string;
  images: string[];
};

export type VideoProject = {
  title: string;
  src: string;
  poster: string;
};

export async function getPhotoProjects(): Promise<PhotoProject[]> {
  try {
    const response = await client.getEntries({
      content_type: 'photoProject',
      select: ['fields.title', 'fields.images'],
    });

    return response.items.map((item: any) => ({
      title: item.fields.title,
      images: item.fields.images.map((asset: any) => `https:${asset.fields.file.url}`),
    }));
  } catch (error) {
    console.log('Photo projects not found in Contentful, using mock data');
    return [];
  }
}

export async function getVideoProjects(): Promise<VideoProject[]> {
  try {
    const response = await client.getEntries({
      content_type: 'videoProject',
      select: ['fields.title', 'fields.video', 'fields.poster'],
    });

    return response.items.map((item: any) => ({
      title: item.fields.title,
      src: `https:${item.fields.video.fields.file.url}`,
      poster: `https:${item.fields.poster.fields.file.url}`,
    }));
  } catch (error) {
    console.log('Video projects not found in Contentful, using mock data');
    return [];
  }
}

export async function getAllContent() {
  // Check if Contentful is configured
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.log('Contentful not configured, using mock data');
    return {
      photoProjects: [
        {
          title: 'Project A',
          images: [
            '/images/project-a/1.jpg',
            '/images/project-a/2.jpg',
            '/images/project-a/3.jpg',
          ],
        },
        {
          title: 'Project B',
          images: [
            '/images/project-b/4.jpg',
            '/images/project-b/5.jpg',
            '/images/project-b/6.jpg',
          ],
        },
        {
          title: 'Project C',
          images: ['/images/project-c/7.jpg', '/images/project-c/8.jpg'],
        },
      ],
      videoProjects: [
        {
          title: 'Video A',
          src: '/videos/video-a.mp4',
          poster: '/images/video-a/1.jpg',
        },
        {
          title: 'Video B',
          src: '/videos/video-b.mp4',
          poster: '/images/video-b/1.jpg',
        },
        {
          title: 'Video C',
          src: '/videos/video-c.mp4',
          poster: '/images/video-c/1.jpg',
        },
      ],
    };
  }

  try {
    const [photoProjects, videoProjects] = await Promise.all([
      getPhotoProjects(),
      getVideoProjects(),
    ]);

    return { photoProjects, videoProjects };
  } catch (error) {
    console.error('Error fetching from Contentful, using mock data:', error);
    // Return mock data as fallback
    return {
      photoProjects: [
        {
          title: 'Project A',
          images: [
            '/images/project-a/1.jpg',
            '/images/project-a/2.jpg',
            '/images/project-a/3.jpg',
          ],
        },
        {
          title: 'Project B',
          images: [
            '/images/project-b/4.jpg',
            '/images/project-b/5.jpg',
            '/images/project-b/6.jpg',
          ],
        },
        {
          title: 'Project C',
          images: ['/images/project-c/7.jpg', '/images/project-c/8.jpg'],
        },
      ],
      videoProjects: [
        {
          title: 'Video A',
          src: '/videos/video-a.mp4',
          poster: '/images/video-a/1.jpg',
        },
        {
          title: 'Video B',
          src: '/videos/video-b.mp4',
          poster: '/images/video-b/1.jpg',
        },
        {
          title: 'Video C',
          src: '/videos/video-c.mp4',
          poster: '/images/video-c/1.jpg',
        },
      ],
    };
  }
}

