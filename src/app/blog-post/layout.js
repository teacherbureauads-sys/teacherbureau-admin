import { BlogLayout } from "~/components/layout/blog_layout";
import DashboardLayout from "~/components/layout/dashboard_layout";

const BlogRootLayout = ({ children }) => {
  return (
    <DashboardLayout pageTitle="Blog Post">
      <BlogLayout>{children}</BlogLayout>
    </DashboardLayout>
  );
};

export default BlogRootLayout;
