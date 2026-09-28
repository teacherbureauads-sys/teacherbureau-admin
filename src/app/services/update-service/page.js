import CreateService from "~/components/section/services/create_servce";

const UpdateServicePage = ({ searchParams }) => {
  const { serviceId, details = "{}" } = searchParams;

  return (
    <CreateService serviceId={serviceId} serviceDetails={JSON.parse(details)} />
  );
};

export default UpdateServicePage;
