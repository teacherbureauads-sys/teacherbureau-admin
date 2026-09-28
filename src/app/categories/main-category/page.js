import { CreateMainCategory } from "~/components/section/category/create_main_category";

const CreateBrandPage = ({ searchParams }) => {
  const { categoryId } = searchParams;
  return <CreateMainCategory categoryId={categoryId} />;
};

export default CreateBrandPage;
