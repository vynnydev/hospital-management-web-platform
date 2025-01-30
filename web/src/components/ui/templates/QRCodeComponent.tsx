import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ value, size = 180, level = 'H' }) => {
  return (
    <div className="p-2 bg-white rounded-xl shadow-lg transform transition-transform hover:scale-105">
      <QRCodeCanvas value={value} size={size} level={level} />
    </div>
  );
};

export default QRCodeComponent;