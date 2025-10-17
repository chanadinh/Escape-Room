import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QRScan from '@/lib/models/QRScan';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { qrCode, ipAddress, userAgent, sessionId } = body;

    // Validate required fields
    if (!qrCode || !['qr_1', 'qr_2', 'qr_3', 'qr_4'].includes(qrCode)) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 400 }
      );
    }

    // Create QR scan record
    const qrScan = new QRScan({
      qrCode,
      ipAddress,
      userAgent,
      sessionId,
      timestamp: new Date()
    });

    await qrScan.save();

    return NextResponse.json({
      success: true,
      message: `QR code ${qrCode} scanned successfully`,
      scanId: qrScan._id
    });

  } catch (error) {
    console.error('QR scan logging error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const qrCode = searchParams.get('qr');

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code parameter required' },
        { status: 400 }
      );
    }

    const scans = await QRScan.find({ qrCode }).sort({ timestamp: -1 }).limit(10);

    return NextResponse.json({ scans });

  } catch (error) {
    console.error('QR scan retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
