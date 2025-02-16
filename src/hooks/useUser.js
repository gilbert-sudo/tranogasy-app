import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/redux";
import { useLocation } from "wouter";
import { usePhoto } from "./usePhoto";
export const useUser = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bootstrapClassname, setBootstrap] = useState(null);
  const [location, setLocation] = useLocation();

  const { deleteImg } = usePhoto();

  //redux
  const dispatch = useDispatch();

  const updateUser = async (params) => {
    setIsLoading(true);
    const { userId } = params;

    const newAvatar = params?.avatar;
    const oldAvatar = user?.avatar;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(params),
        }
      );

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
        setBootstrap("alert alert-danger");
      }

      if (response.ok) {
        //delete the old avatar of the connected user
        if (oldAvatar && oldAvatar.startsWith("http") && oldAvatar !== newAvatar) {
          deleteImg(oldAvatar);
          console.log("deleted the old avatar", oldAvatar);
        }

        setBootstrap("alert alert-success");
        localStorage.setItem("user", JSON.stringify(json));
        dispatch(setUser(json.user));
        setIsLoading(false);
        if (location === "/editProfile") {
          setLocation("/user");
        }
      }
    } catch (error) {
      setIsLoading(false);
      setLocation("/nosignal");
    }
  };

  const getUserById = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        return json.user;
      }
    } catch (error) {
      console.log(error);
      window.history.back();
    }
  };

  return {
    updateUser,
    getUserById,
    isLoading,
    setIsLoading,
    error,
    bootstrapClassname,
  };
};
