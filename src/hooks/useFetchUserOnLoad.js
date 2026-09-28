import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByToken } from "~/lib/redux/slices/auth-slice";

export const useFetchUserOnLoad = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.fullName && token) {
      dispatch(fetchUserByToken(token));
    }
  }, [token, dispatch]);
};
