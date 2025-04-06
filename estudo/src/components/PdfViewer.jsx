import { useEffect, useState } from "react";
import Script from "next/script";

const PDFViewer = ({ url }) => {
  const [adobeLoaded, setAdobeLoaded] = useState(false);

  useEffect(() => {
    if (adobeLoaded && window.AdobeDC) {
      const adobeDCView = new window.AdobeDC.View({
       // clientId: "288835b1e4a54c15a34b9004d0053aa6", vercel
        clientId: "7b97ac0ffa3a47b08d47b91ed7021261", // localhost
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
  }, [adobeLoaded, url]);

  return (
    <>
      <Script
        src="https://documentservices.adobe.com/view-sdk/viewer.js"
        strategy="afterInteractive"
        onLoad={() => setAdobeLoaded(true)}
        onError={(e) => console.error("Erro ao carregar Adobe SDK", e)}
      />
      <div id="adobe-dc-view" style={{ width: "100%", height: "600px", margin: "0 auto", overflow: "auto" }} />
    </>
  );
};

export default PDFViewer;
