import ArticleForm from "@/components/ArticleForm";
import { createArticle } from "@/lib/actions/article";

export const metadata = {
  title: "Write New Article",
  description: "Create a new blog article using our rich text editor",
};

/**
 * Feature: Write Article Page
 * Page for creating new articles with a rich text editor
 */
export default function WritePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Write New Article</h1>

      <ArticleForm
        onSubmit={async (data) => {
          "use server";
          await createArticle(data);
        }}
      />
    </div>
  );
}
