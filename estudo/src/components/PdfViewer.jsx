import { useEffect, useRef } from "react";
import Script from "next/script";

const PDFViewer = ({ url }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const loadAdobeSDK = () => {
      if (window.AdobeDC && viewerRef.current) {
        const adobeDCView = new window.AdobeDC.View({
          clientId: process.env.NODE_ENV === "development" 
            ? "7b97ac0ffa3a47b08d47b91ed7021261" 
            : "288835b1e4a54c15a34b9004d0053aa6",
          divId: "adobe-dc-view",
        });

        adobeDCView.previewFile(
          {
            content: { location: { url } },
            metaData: { fileName: "Documento.pdf" },
          },
          { embedMode: "SIZED_CONTAINER" }
        );
      }
    };

    // If SDK is already loaded
    if (window.AdobeDC) {
      loadAdobeSDK();
    } else {
      // Wait for the SDK to be ready
      document.addEventListener("adobe_dc_view_sdk.ready", loadAdobeSDK);
    }

    return () => {
      document.removeEventListener("adobe_dc_view_sdk.ready", loadAdobeSDK);
    };
  }, [url]);

  return (
    <>
      <Script
        src="https://documentservices.adobe.com/view-sdk/viewer.js"
        strategy="afterInteractive"
      />
      <div 
        id="adobe-dc-view" 
        ref={viewerRef}
        style={{ 
          width: "100%", 
          height: "600px", 
          margin: "0 auto", 
          overflow: "auto" 
        }} 
      />
    </>
  );
};

export default PDFViewer;