
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample blog post data
  const samplePosts: BlogPost[] = [
    {
      id: 1,
      title: "Getting Started with React and Django",
      excerpt: "Learn how to build a full-stack application with React and Django",
      author: "Jane Cooper",
      date: "Mar 14, 2025",
      readTime: "5 min read",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      title: "Implementing Dark Mode with Tailwind CSS",
      excerpt: "A step-by-step guide to add dark mode to your application",
      author: "Alex Morgan",
      date: "Mar 10, 2025",
      readTime: "3 min read",
      imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=2300&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      title: "Working with QR Codes in JavaScript",
      excerpt: "Generate and customize QR codes for your web application",
      author: "Michael Johnson",
      date: "Mar 5, 2025",
      readTime: "4 min read",
      imageUrl: "https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
    },
    {
      id: 4,
      title: "Building an Infinite Scroll Feed",
      excerpt: "Implement efficient infinite scrolling in your React application",
      author: "Sarah Williams",
      date: "Mar 1, 2025",
      readTime: "6 min read",
      imageUrl: "https://images.unsplash.com/photo-1610986603166-f78428624e76?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
    },
  ];

  useEffect(() => {
    // Simulate fetching blog posts
    setTimeout(() => {
      setPosts(samplePosts);
      setIsLoading(false);
    }, 15);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden animate-slideUp">
            <div className="aspect-video w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.id} to={`/blog/${post.id}`}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200 card-custom">
            {post.imageUrl && (
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm font-medium">By {post.author}</div>
              <Button variant="ghost" size="sm">
                Read more →
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
