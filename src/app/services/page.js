import { AllService } from "~/components/section/services/all_service";

const AllServicePage = async ({ searchParams }) => {
  const { page } = await searchParams;
  return <AllService page={page} />;
};

export default AllServicePage;
