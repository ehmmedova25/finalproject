import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductZoom = ({ image }) => {
  return (
    <div style={{ maxWidth: "400px", marginBottom: "10px" }}>
      <Zoom>
        <img
          src={image}
          alt="product"
          style={{ width: "100%", borderRadius: "8px", cursor: "zoom-in" }}
        />
      </Zoom>
    </div>
  );
};

export default ProductZoom;
