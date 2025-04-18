
import { useParams } from "react-router-dom";
import { BlogList } from "@/components/blog/BlogList";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Blog = () => {
  const { action } = useParams<{ action: string }>();

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col ">
      <div className="container-custom flex-grow">
        {action === "new" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="page-heading">Create New Post</h1>
              <Link to="/blog">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
            <BlogEditor />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="page-heading">Blog</h1>
              <Link to="/blog/new">
                <Button>Create New Post</Button>
              </Link>
            </div>
            <BlogList />
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
