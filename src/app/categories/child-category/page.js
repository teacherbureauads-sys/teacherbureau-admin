import { CreateChildCategory } from "~/components/section/category/create_child_category";

const CreateBrandPage = ({ searchParams }) => {
  const { categoryId } = searchParams;

  return <CreateChildCategory childCategoryId={categoryId} />;
};

export default CreateBrandPage;
