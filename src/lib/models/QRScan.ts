import mongoose from 'mongoose';

const QRScanSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    required: true,
    enum: ['qr_1', 'qr_2', 'qr_3', 'qr_4']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: false
  }
});

export default mongoose.models.QRScan || mongoose.model('QRScan', QRScanSchema);
