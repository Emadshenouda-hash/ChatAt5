import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import { loadBlogPosts } from "@/utils/contentLoader";
import { Link } from "react-router-dom";

const Blog = () => {
  const { language, t } = useContext(LanguageContext);
  const posts = loadBlogPosts().filter(p => p.language === language);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-deep-plum mb-6 text-center">{t.nav.blog}</h1>
      {posts.length === 0 ? (
        <p>{t.general.noContent}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-600">{post.date}</p>
              <p className="text-gray-700 mt-2">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="text-blue-600 mt-3 block">{t.general.readMore}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;