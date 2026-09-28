import DashboardLayout from "~/components/layout/dashboard_layout";
import MainDashboard from "~/components/section/dashboard";

export default function Home() {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <MainDashboard />
    </DashboardLayout>
  );
}
