import toast from "react-hot-toast";

const successToast = (message) => {
  toast.success(message, {
    duration: 800,
    style: {
      background: "#000",
      fontSize: "14px",
      color: "#FFFF",
      borderRadius: "5px",
    },
  });
};

const errorToast = (message) => {
  toast.error(message, {
    duration: 800,
    style: {
      background: "#000",
      fontSize: "14px",
      color: "#FFFF",
      borderRadius: "5px",
    },
  });
};
const alertToast = (message) => {
  toast(message, {
    duration: 800,
    icon: "⚠️",
    style: {
      background: "#000",
      fontSize: "14px",
      color: "#FFFF",
      borderRadius: "5px",
    },
  });
};

export { successToast, errorToast, alertToast };
