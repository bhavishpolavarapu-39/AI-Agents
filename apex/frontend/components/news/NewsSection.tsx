'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  publish_date: string;
  sentiment?: string;
  relevance_score?: number;
  related_symbols?: string[];
}

export default function NewsSection({ symbols }: { symbols?: string[] }) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const params = new URLSearchParams({ limit: '20', days_back: '7' });
        if (symbols?.length) params.append('symbols', symbols.join(','));
        const response = await fetch(`${apiUrl}/api/apex/news?${params}`);
        const data = await response.json();
        setNews(data.news || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [symbols]);

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-500/20 text-green-400';
      case 'negative':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Market News & Sentiment</h3>
        <p className="text-sm text-slate-500">Latest financial news with AI sentiment analysis</p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 mt-3">Loading news...</p>
          </div>
        ) : news.length === 0 ? (
          <p className="text-center py-8 text-slate-500">No news articles found</p>
        ) : (
          news.map((article, i) => (
            <motion.a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-green-900/10 bg-slate-800/30 hover:border-green-500/30 transition"
              whileHover={{ x: 4 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1 line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-slate-400">{article.source}</p>
                </div>
                {article.sentiment && (
                  <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                    {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-300 line-clamp-2 mb-2">{article.summary}</p>
              <div className="flex justify-between items-end">
                <div className="flex gap-2 flex-wrap">
                  {article.related_symbols?.slice(0, 3).map((symbol) => (
                    <span key={symbol} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {symbol}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-500">{new Date(article.publish_date).toLocaleDateString()}</div>
              </div>
            </motion.a>
          ))
        )}
      </div>
    </motion.div>
  );
}
