const ModalOverlay = ({
  onClose,
  children,
  customClass = "flex justify-center items-center",
  open = false,
}) => {
  return (
    open && (
      <section
        className={`${customClass} w-full h-full fixed z-[99] bg-[#000] bg-opacity-15 left-0 top-0 backdrop-blur-[2px]`}
        onClick={onClose}
      >
        <div className="w-full h-auto" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </section>
    )
  );
};

export default ModalOverlay;
