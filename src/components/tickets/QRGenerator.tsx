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
        size={320}
        level="H"
        bgColor="#1b2739"
        fgColor="#CCDAF7"
        title={ticketId}
      />
      <p className="mt-2 text-sm text-gray-500">
        Vendors - Scan to Verify Transaction
      </p>
    </div>
  );
};

export default QRGenerator;