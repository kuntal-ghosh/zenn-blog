import { DataService } from "@/lib/data-service";
import { Bookmark, Github, Heart, Twitter } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { TableOfContents } from "@/components/markdown/table-of-contents";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Define heading components outside of the component
const HeadingWithSeparator: React.FC<{
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
}> = ({ level: HeadingTag, children }) => {
  if (!children || typeof children !== "string") return null;
  const id = children
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  return (
    <div>
      <HeadingTag id={id}>
        <div className="mt-4">{children}</div>
      </HeadingTag>
      <hr className="my-3" />
    </div>
  );
};

// Define custom component renderers outside of the main component
const customComponents = {
  h1: (props: any) => (
    <HeadingWithSeparator level="h1">{props.children}</HeadingWithSeparator>
  ),
  h2: (props: any) => (
    <HeadingWithSeparator level="h2">{props.children}</HeadingWithSeparator>
  ),
  h3: (props: any) => (
    <HeadingWithSeparator level="h3">{props.children}</HeadingWithSeparator>
  ),
  h4: (props: any) => (
    <HeadingWithSeparator level="h4">{props.children}</HeadingWithSeparator>
  ),
  h5: (props: any) => (
    <HeadingWithSeparator level="h5">{props.children}</HeadingWithSeparator>
  ),
  h6: (props: any) => (
    <HeadingWithSeparator level="h6">{props.children}</HeadingWithSeparator>
  ),
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await DataService.getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Social Sidebar - Fixed on left side */}
      <aside className="fixed left-6 top-1/3 hidden lg:flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center">
          <button className="p-3 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
            <Heart className="h-6 w-6 text-gray-400" />
          </button>
          <span className="text-sm text-gray-500 mt-1">481</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="p-3 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
            <Bookmark className="h-6 w-6 text-gray-400" />
          </button>
          <span className="text-sm text-gray-500 mt-1">4</span>
        </div>
      </aside>

      <main className="container mx-auto px-4 py-8">
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            <p className="text-gray-500 mb-6">
              Published On: {article.createdAt}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white"
              >
                <span className="bg-black text-white rounded-full p-1 text-xs">
                  N
                </span>
                <span>Next.js</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white"
              >
                <span className="bg-blue-400 text-white rounded-full p-1 text-xs">
                  ⚛
                </span>
                <span>React</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white"
              >
                <span className="bg-blue-600 text-white rounded-full p-1 text-xs">
                  TS
                </span>
                <span>TypeScript</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white"
              >
                <span className="bg-gray-200 text-gray-700 rounded-full p-1 text-xs">
                  #
                </span>
                <span>design</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white"
              >
                <span className="bg-blue-500 text-white rounded-full p-1 text-xs">
                  □
                </span>
                <span>frontend</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white"
              >
                <span className="bg-yellow-400 text-white rounded-full p-1 text-xs">
                  ≡
                </span>
                <span>Tech</span>
              </Badge>
            </div>

            <div className="rounded-lg shadow-sm p-8 mb-8">
              <ReactMarkdown components={customComponents}>
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Right Sidebar - Sticky */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32">
              {/* Author Profile Card */}
              <Card className="mb-8">
                <CardContent className="">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between gap-x-4">
                      <span>Image</span>
                      <div className="flex flex-col  mb-2">
                        <h2 className="text-xl font-semibold ">Yoshiko</h2>
                        <div className="flex items-center gap-2 mb-2">
                          <Button variant="outline" className="mb-2">
                            Follow
                          </Button>
                          <div className="flex gap-2 mb-2">
                            <Link
                              href="#"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Github className="h-5 w-5" />
                            </Link>
                            <Link
                              href="#"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Twitter className="h-5 w-5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" w-full text-sm">
                      <p className="flex col-gap-2">
                        <span className="text-gray-700">💼</span>
                        <span>
                          Front-end Engineer @{" "}
                          <Link
                            href="https://kwork.studio"
                            className="text-blue-500 hover:underline"
                          >
                            kwork.studio
                          </Link>
                        </span>
                      </p>
                    </div>

                    <Button className="w-full mt-2 bg-blue-500 hover:bg-blue-600">
                      Give a badge
                    </Button>

                    <Link
                      href="#"
                      className="text-sm text-gray-500 mt-2 flex items-center"
                    >
                      What is a badge giver? <span className="ml-1">→</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Table of Contents with sticky behavior */}
              <div className="sticky top-64">
                <TableOfContents content={article.content} />
              </div>
            </div>
          </aside>
        </article>
      </main>

      {/* Mobile Social Actions - Shown only on mobile/tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around">
        <button className="flex flex-col items-center">
          <Heart className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500">481</span>
        </button>
        <button className="flex flex-col items-center">
          <Bookmark className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500">4</span>
        </button>
      </div>
    </div>
  );
}
