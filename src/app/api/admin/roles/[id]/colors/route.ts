import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { z } from 'zod';

const updateColorsSchema = z.object({
  gradientStart: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color format'),
  gradientEnd: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color format'),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and permissions
  const authResult = await requireAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const roleId = parseInt(params.id, 10);
    if (isNaN(roleId)) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateColorsSchema.parse(body);

    // TODO: When implementing custom role colors, this would:
    // 1. Update the role record in the database with custom color fields
    // 2. Update the roleColors.ts utility to check database for custom colors first
    // 3. Cache the custom colors for performance

    // For now, just return a success response to indicate the API structure is ready
    console.log('Role color update request:', {
      roleId,
      gradientStart: validatedData.gradientStart,
      gradientEnd: validatedData.gradientEnd,
    });

    return NextResponse.json({
      message: 'Role colors updated successfully',
      roleId,
      colors: {
        gradientStart: validatedData.gradientStart,
        gradientEnd: validatedData.gradientEnd,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error('Error updating role colors:', error);
    return NextResponse.json({ error: 'Failed to update role colors' }, { status: 500 });
  }
}
