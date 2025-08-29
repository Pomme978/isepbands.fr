import { NextResponse } from 'next/server';
import { MUSIC_GENRES } from '@/data/musicGenres';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: MUSIC_GENRES,
    });
  } catch (error) {
    console.error('Error fetching music genres:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch music genres',
      },
      { status: 500 },
    );
  }
}
