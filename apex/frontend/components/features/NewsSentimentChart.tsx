'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // 0-100
  relevance: number; // 0-100
  tags: string[];
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Tech Sector Reaches New All-Time High on Strong Earnings',
    source: 'Reuters',
    date: '2 hours ago',
    sentiment: 'positive',
    sentimentScore: 92,
    relevance: 95,
    tags: ['Technology', 'Market', 'AAPL', 'MSFT', 'GOOGL'],
  },
  {
    id: '2',
    title: 'Market Volatility Increases Amid Interest Rate Concerns',
    source: 'Bloomberg',
    date: '4 hours ago',
    sentiment: 'negative',
    sentimentScore: 25,
    relevance: 88,
    tags: ['Market', 'Economy', 'FED'],
  },
  {
    id: '3',
    title: 'Apple Announces New Product Line, Stock Rises 3%',
    source: 'CNBC',
    date: '6 hours ago',
    sentiment: 'positive',
    sentimentScore: 88,
    relevance: 100,
    tags: ['Technology', 'AAPL', 'Product'],
  },
  {
    id: '4',
    title: 'Oil Prices Stabilize After Geopolitical Tensions Ease',
    source: 'Financial Times',
    date: '8 hours ago',
    sentiment: 'neutral',
    sentimentScore: 55,
    relevance: 45,
    tags: ['Energy', 'Commodities', 'XOM'],
  },
  {
    id: '5',
    title: 'Inflation Data Comes in Below Expectations, Dollar Weakens',
    source: 'MarketWatch',
    date: '10 hours ago',
    sentiment: 'positive',
    sentimentScore: 85,
    relevance: 92,
    tags: ['Economy', 'Inflation', 'Market'],
  },
  {
    id: '6',
    title: 'Major Tech Company Faces Regulatory Scrutiny',
    source: 'Wall Street Journal',
    date: '12 hours ago',
    sentiment: 'negative',
    sentimentScore: 30,
    relevance: 87,
    tags: ['Technology', 'Regulation', 'GOOGL'],
  },
];

const generateSentimentTrend = () => {
  return [
    { time: '00:00', positive: 45, negative: 25, neutral: 30 },
    { time: '06:00', positive: 52, negative: 22, neutral: 26 },
    { time: '12:00', positive: 58, negative: 20, neutral: 22 },
    { time: '18:00', positive: 62, negative: 18, neutral: 20 },
    { time: '24:00', positive: 68, negative: 16, neutral: 16 },
  ];
};

export default function NewsSentimentChart() {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [sentimentData] = useState(generateSentimentTrend());

  const filteredNews = filter === 'all' ? NEWS_ARTICLES : NEWS_ARTICLES.filter(n => n.sentiment === filter);

  const sentimentCounts = {
    positive: NEWS_ARTICLES.filter(n => n.sentiment === 'positive').length,
    negative: NEWS_ARTICLES.filter(n => n.sentiment === 'negative').length,
    neutral: NEWS_ARTICLES.filter(n => n.sentiment === 'neutral').length,
  };

  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive },
    { name: 'Negative', value: sentimentCounts.negative },
    { name: 'Neutral', value: sentimentCounts.neutral },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-2 backdrop-blur">
          <p className="text-white font-semibold text-sm">{payload[0].payload.time}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <h3 className="text-2xl font-bold text-white mb-2">Market News Sentiment</h3>
        <p className="text-gray-400">Real-time sentiment analysis of financial news and market developments</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Positive', value: sentimentCounts.positive, color: 'bg-green-500/20 text-green-400' },
          { label: 'Negative', value: sentimentCounts.negative, color: 'bg-red-500/20 text-red-400' },
          { label: 'Neutral', value: sentimentCounts.neutral, color: 'bg-gray-500/20 text-gray-300' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={`liquid-glass border border-white/20 rounded-lg p-4 backdrop-blur ${stat.color}`}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-gray-400 mb-2">{stat.label} Articles</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Pie Chart */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Trend */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Sentiment Trend (24h)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="positive" fill="#10b981" />
                <Bar dataKey="negative" fill="#ef4444" />
                <Bar dataKey="neutral" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {(['all', 'positive', 'negative', 'neutral'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === filterType
                ? filterType === 'all'
                  ? 'bg-white text-black'
                  : filterType === 'positive'
                  ? 'bg-green-500 text-white'
                  : filterType === 'negative'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* News Articles List */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <h4 className="text-lg font-semibold text-white mb-4">Latest Articles</h4>
        <div className="space-y-3">
          {filteredNews.map((article, index) => (
            <motion.div
              key={article.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                  article.sentiment === 'positive' ? 'bg-green-400' :
                  article.sentiment === 'negative' ? 'bg-red-400' :
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <h5 className="font-semibold text-white mb-1">{article.title}</h5>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="mb-2">
                    <p className="text-xs text-gray-400">Sentiment</p>
                    <p className={`font-bold ${
                      article.sentiment === 'positive' ? 'text-green-400' :
                      article.sentiment === 'negative' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>{article.sentimentScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Relevance</p>
                    <p className="font-bold text-blue-400">{article.relevance}%</p>
                  </div>
                </div>
              </div>
              {/* Sentiment Score Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    article.sentiment === 'positive' ? 'bg-green-400' :
                    article.sentiment === 'negative' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`}
                  style={{ width: `${article.sentimentScore}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sentiment Key */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs font-semibold text-gray-400 mb-3">Sentiment Legend</p>
        <div className="flex gap-4 flex-wrap">
          {[
            { label: 'Positive (>70)', color: 'bg-green-500' },
            { label: 'Neutral (30-70)', color: 'bg-gray-400' },
            { label: 'Negative (<30)', color: 'bg-red-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${item.color}`}></div>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
