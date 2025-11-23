import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetchEarthquakeNews } from '@/api/news';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const getTimeAgo = (dateString: string): string => {
  const now = Date.now();
  const timestamp = new Date(dateString).getTime();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export function NewsPanel() {
  const { data, error, isLoading } = useSWR('earthquake-news', () => fetchEarthquakeNews(10), {
    refreshInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading news...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake News</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load news</p>
        </CardContent>
      </Card>
    );
  }

  if (data.articles.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake News</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No news available. Add your NewsAPI key to the .env file to enable news features.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Get your free API key from{' '}
            <a
              href="https://newsapi.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              newsapi.org
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Earthquake News</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest earthquake-related news from around the world
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.articles.map((article, index) => (
              <motion.div
                key={`${article.url}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="group p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-all">
                  <div className="flex gap-4">
                    {article.urlToImage && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-muted">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {article.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium">{article.source.name}</span>
                        <span>•</span>
                        <span>{getTimeAgo(article.publishedAt)}</span>
                      </div>

                      <div className="mt-2">
                        <Button variant="link" size="sm" asChild className="h-auto p-0">
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            Read more →
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
