import { useLocation as useLocationFromWouter } from "wouter";

export const usePhoto = () => {
  const [, setLocation] = useLocationFromWouter();

  const deleteImg = async (imageUrl) => {
    console.log("on the hook deletion ", imageUrl);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/images/server-delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ imageUrl }),
        }
      );
    } catch (error) {
      setLocation("/nosignal");
      console.log(error);
    }
  };

  return {
    deleteImg,
  };
};
