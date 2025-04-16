import React from "react";
import BlogListContainer from "@/features/blog/components/container/BlogListContainer";
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";

const HomePage = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
        <BlogListContainer />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
