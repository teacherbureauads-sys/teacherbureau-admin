import { AllBlog } from "~/components/section/blog/all_blog";

const BlogPostPage = async ({ searchParams }) => {
  const { page } = await searchParams;

  return <AllBlog page={page} />;
};

export default BlogPostPage;
