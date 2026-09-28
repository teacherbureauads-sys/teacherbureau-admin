import { CreateSubCategory } from "~/components/section/category/create_sub_category";

const CreateBrandPage = ({ searchParams }) => {
  const { categoryId } = searchParams;

  return <CreateSubCategory subCategoryId={categoryId} />;
};

export default CreateBrandPage;
