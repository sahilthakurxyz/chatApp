import React from "react";
import defaultImage from "../../assets/default.jpg";
const Avatar = ({ className, image, alt }) => {
  return (
    <img
      src={image}
      alt={alt || "Avatar"}
      onError={(event) => (event.target.src = defaultImage)}
      className={`${className} transition-all duration-300 ease-in-out cursor-pointer shadow-md rounded-full`}
    />
  );
};

export default Avatar;
