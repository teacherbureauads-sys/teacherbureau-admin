import "./loader.style.css";

const LineLoader = ({ bg = "bg-white" }) => {
  const design = (
    <>
      <div className="loaderRectangle">
        <div className={`${bg}`}></div>
        <div className={`${bg}`}></div>
        <div className={`${bg}`}></div>
      </div>
    </>
  );
  return design;
};

export default LineLoader;
