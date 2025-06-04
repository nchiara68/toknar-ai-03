import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export const PdfTxtFileUploader = () => {
  return (
    <FileUploader
      acceptedFileTypes={['application/pdf', 'text/plain']}
      path="public/"
      maxFileCount={1}
      isResumable
      onUploadSuccess={({ key }) => {
        console.log('Upload successful:', key);
        // Trigger Textract API or other post-upload actions here
      }}
    />
  );
};
