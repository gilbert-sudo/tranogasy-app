import { useSelector, useDispatch } from "react-redux";
import { addLike, addLikeToUserState, deleteLike, removeLikeFromUserState } from "../redux/redux";

export const useLike = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const like = async (property) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        userId: user._id,
        propertyId : property._id,
      }),
    });

    if (response.ok) {
      dispatch(addLikeToUserState(property._id));
      dispatch(addLike(property));
      console.log("item liked");
    }
  };

  const disLike = async (property) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/favorite`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        userId: user._id,
        propertyId : property._id,
      }),
    });
    if (response.ok) {
      dispatch(removeLikeFromUserState(property._id));
      dispatch(deleteLike(property._id));
      console.log("item disliked");
    }
  };

  return { like, disLike };
};
