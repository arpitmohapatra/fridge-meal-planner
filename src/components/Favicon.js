import React, { useEffect } from "react";
import { ChefHat } from "lucide-react";
import ReactDOMServer from "react-dom/server";

const Favicon = () => {
  useEffect(() => {
    // Create the SVG string from the ChefHat icon
    const svgString = ReactDOMServer.renderToString(
      // orange color
      <ChefHat color="#ffa500" size={32} strokeWidth={2} />
    );

    // Convert SVG string to a data URL
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    // Create or update the favicon link element
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/svg+xml";
    link.rel = "icon";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);

    // Clean up the object URL when the component unmounts
    return () => URL.revokeObjectURL(url);
  }, []);

  return null; // This component doesn't render anything
};

export default Favicon;
