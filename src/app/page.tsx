import { getAllContent } from '../../lib/contentful';
import PortfolioClient from './portfolio-client';

export default async function HomePage() {
  // Fetch data on the server
  const { photoProjects, videoProjects } = await getAllContent();
  
  // Pass data to client component
  return <PortfolioClient photoProjects={photoProjects} videoProjects={videoProjects} />;
}
