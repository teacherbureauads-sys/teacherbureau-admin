import DashboardLayout from "~/components/layout/dashboard_layout";
import { ServiceLayout } from "~/components/layout/service_layout";

const BlogRootLayout = ({ children }) => {
  return (
    <DashboardLayout pageTitle="Service">
      <ServiceLayout>{children}</ServiceLayout>
    </DashboardLayout>
  );
};

export default BlogRootLayout;
