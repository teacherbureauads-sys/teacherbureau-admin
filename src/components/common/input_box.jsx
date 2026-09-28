import LineLoader from "../loader/line_loader";

export const Input = (props) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <label className="first-letter:capitalize text-[12px] font-[600] text-black ">
        {props.label}
      </label>
      <div className="flex flex-row items-center justify-between text-[13px] disabled:cursor-not-allowed disabled:opacity-80 w-full outline-none border border-gray-200 h-[40px] rounded-[5px] p-[10px] bg-transparent font-medium placeholder:font-normal">
        <input {...props} className="w-full h-full text-balance" />

        {props.icon && (
          <i
            onClick={props.onIconClick}
            className="text-cyan-600 cursor-pointer text-xl text-balance"
          >
            {props.icon}
          </i>
        )}
      </div>

      {props.error && (
        <span className="text-xs text-red-500 first-letter:capitalize">
          {props.error}
        </span>
      )}
    </div>
  );
};

export const SelectBox = (props) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <label className="text-[12px] font-[600] text-black first-letter:capitalize">
        {props.label}
      </label>
      <select
        {...props}
        className=" disabled:cursor-not-allowed disabled:opacity-80 w-full outline-none border border-gray-200 h-[40px] rounded-[5px] p-[10px] bg-transparent text-[13px] font-medium placeholder:font-normal first-letter:capitalize"
      >
        <option value="">{props.placeholder}</option>

        {props.option?.map((data, index) => {
          const { text, value } = data;
          return (
            <option
              key={index}
              value={value}
              className="first-letter:capitalize"
            >
              {text}
            </option>
          );
        })}
      </select>
      {props.error && (
        <span className="text-xs text-red-500 first-letter:capitalize">
          {props.error}
        </span>
      )}
    </div>
  );
};

export const Button = (props) => {
  return (
    <button
      disabled={props.loading}
      {...props}
      className={`${props.customClass} transition-all duration-100 h-[38px]  font-medium  text-[14px]  rounded-[5px] bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {props.loading ? <LineLoader /> : props.children}
    </button>
  );
};
