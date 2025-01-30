import { QRCodeCanvas } from 'qrcode.react';

interface QRGeneratorProps {
  ticketId: string;
  transactionId: string;
}

const QRGenerator = ({ ticketId, transactionId }: QRGeneratorProps) => {
  const validationUrl = `${window.location.origin}/validation?ticketId=${ticketId}&transactionId=${transactionId}`;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <QRCodeCanvas 
        value={validationUrl}
        size={200}
        level="H"
        includeMargin={true}
      />
      <p className="mt-2 text-sm text-gray-500">
        Scan to verify ticket
      </p>
    </div>
  );
};

export default QRGenerator;