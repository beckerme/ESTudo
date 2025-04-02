import { useEffect } from "react";

const PDFViewer = ({ url }) => {
  useEffect(() => {
    const adobeDCView = new window.AdobeDC.View({
      clientId: "288835b1e4a54c15a34b9004d0053aa6", // Substitua pela tua Client ID
      divId: "adobe-dc-view",
    });

    adobeDCView.previewFile(
      {
        content: { location: { url } },
        metaData: { fileName: "Documento.pdf" },
      },
      { embedMode: "IN_LINE" }
    );
  }, [url]);

  return <div id="adobe-dc-view" style={{ width: "100%", height: "600px" }} />;
};

export default PDFViewer;
