"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "~/components/common/input_box";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "~/lib/redux/slices/auth-slice";
import { errorToast } from "~/utils/toastMessage";
const SignIn = () => {
  const [formData, setFormData] = useState({
    phoneNo: "8210925188",
    password: "12345",
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(signIn(formData));
    if (signIn.fulfilled.match(resultAction)) {
      router.push("/");
      const { token, data } = resultAction.payload;
    } else {
      const message = resultAction?.payload;
      errorToast(message);

      console.log(resultAction);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-50 p-5">
      <form
        onSubmit={handleSubmit}
        className="rounded bg-white mx-auto w-full sm:w-[60%] lg:w-[50%] p-5 xl:w-[30%] flex flex-col gap-3"
      >
        <h2 className="font-normal text-gray-500 text-xl">
          Sign in to your dashboard
        </h2>
        <Input
          required
          disabled={loading}
          value={formData?.phoneNo}
          onChange={handleChange}
          name="phoneNo"
          label="phone No"
          placeholder="enter mobile no..."
          type="tel"
        />
        <Input
          required
          disabled={loading}
          value={formData?.password}
          onChange={handleChange}
          name="password"
          label="password"
          placeholder="******123"
          type="text"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white font-medium text-[12px] py-3 rounded disabled:opacity-50"
        >
          Sign in
        </button>
      </form>
    </main>
  );
};

export default SignIn;
