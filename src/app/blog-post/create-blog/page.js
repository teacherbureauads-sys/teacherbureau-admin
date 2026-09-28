import { CreateBlogPost } from "~/components/section/blog/create_blog";

const CreateBlogPostPage = ({ searchParams }) => {
  const { blogId, details = "{}" } = searchParams;
  return <CreateBlogPost blogId={blogId} blogDetails={JSON.parse(details)} />;
};

export default CreateBlogPostPage;
