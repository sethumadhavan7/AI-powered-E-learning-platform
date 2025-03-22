import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Youtube, Globe, Bookmark, ExternalLink, Loader2 } from 'lucide-react';
import axios from 'axios';
import YouTube from 'react-youtube';
import ReactMarkdown from 'react-markdown';
import { useAuthStore } from '../store/authStore';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'wiki';
  url: string;
  thumbnail?: string;
  source: string;
  bookmarked: boolean;
}

const ResourceAggregator = () => {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'articles'>('all');
  const [wikiSummary, setWikiSummary] = useState('');
  const { user } = useAuthStore();

  const searchResources = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Simulated API calls (replace with actual API endpoints)
      const videoResults = [
        {
          id: 'video1',
          title: 'Introduction to Machine Learning',
          description: 'A comprehensive guide to ML basics',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=example1',
          thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
          source: 'YouTube',
          bookmarked: false
        },
        {
          id: 'video2',
          title: 'Deep Learning Fundamentals',
          description: 'Understanding neural networks',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=example2',
          thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
          source: 'YouTube',
          bookmarked: false
        }
      ];

      const articleResults = [
        {
          id: 'article1',
          title: 'Getting Started with TensorFlow',
          description: 'Learn how to build your first neural network',
          type: 'article',
          url: 'https://example.com/article1',
          source: 'Medium',
          bookmarked: false
        },
        {
          id: 'article2',
          title: 'Machine Learning Algorithms Explained',
          description: 'A deep dive into popular ML algorithms',
          type: 'article',
          url: 'https://example.com/article2',
          source: 'Towards Data Science',
          bookmarked: false
        }
      ];

      setWikiSummary('Machine learning (ML) is a field of inquiry devoted to understanding and building methods that learn, i.e., methods that leverage data to improve performance on some set of tasks. It is seen as a part of artificial intelligence...');
      setResources([...videoResults, ...articleResults]);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (resourceId: string) => {
    setResources(resources.map(resource =>
      resource.id === resourceId
        ? { ...resource, bookmarked: !resource.bookmarked }
        : resource
    ));
  };

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'all') return true;
    if (activeTab === 'videos') return resource.type === 'video';
    if (activeTab === 'articles') return resource.type === 'article';
    return true;
  });

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Learning Resources</h2>
        <p className="text-indigo-200">Discover curated educational content from across the web</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-300" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Search for any topic (e.g., Machine Learning Basics)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchResources(query)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <TabButton
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
          icon={<Globe className="w-4 h-4" />}
          label="All"
        />
        <TabButton
          active={activeTab === 'videos'}
          onClick={() => setActiveTab('videos')}
          icon={<Youtube className="w-4 h-4" />}
          label="Videos"
        />
        <TabButton
          active={activeTab === 'articles'}
          onClick={() => setActiveTab('articles')}
          icon={<BookOpen className="w-4 h-4" />}
          label="Articles"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      )}

      {/* Wiki Summary */}
      {wikiSummary && !loading && (
        <div className="mb-6 bg-white/5 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Quick Overview</h3>
          <ReactMarkdown className="text-indigo-200 prose prose-invert">
            {wikiSummary}
          </ReactMarkdown>
        </div>
      )}

      {/* Resources Grid */}
      {!loading && filteredResources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onBookmark={() => toggleBookmark(resource.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
          <p className="text-indigo-200">Start searching to discover learning resources</p>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-purple-500 text-white'
        : 'bg-white/5 text-indigo-200 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ResourceCard = ({ resource, onBookmark }: {
  resource: Resource;
  onBookmark: () => void;
}) => (
  <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors">
    {resource.type === 'video' && resource.thumbnail && (
      <img
        src={resource.thumbnail}
        alt={resource.title}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
        <button
          onClick={onBookmark}
          className={`p-2 rounded-lg transition-colors ${
            resource.bookmarked
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-indigo-200 hover:bg-white/10'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
      <p className="text-indigo-200 mt-2 mb-4">{resource.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-indigo-300">{resource.source}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>View Resource</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

export default ResourceAggregator;