'use client';

import { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  url: string;
  headline: string;
  datetime: number;
}

export const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">News</h2>
      <ul>
        {news.slice(0, 5).map((item) => (
          <li key={item.id} className="mb-2 p-2 border-b">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <p className="font-medium">{item.headline}</p>
              <p className="text-sm text-muted-foreground">{new Date(item.datetime * 1000).toLocaleDateString()}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
