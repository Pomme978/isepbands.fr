import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateColorsSchema = z.object({
  gradientStart: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color format'),
  gradientEnd: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color format'),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check authentication and permissions
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { id } = await params;
    const roleId = parseInt(id, 10);
    if (isNaN(roleId)) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = updateColorsSchema.parse(body);

    // Update the role with custom colors
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: {
        gradientStart: validatedData.gradientStart,
        gradientEnd: validatedData.gradientEnd,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Role colors updated successfully',
      roleId,
      colors: {
        gradientStart: updatedRole.gradientStart,
        gradientEnd: updatedRole.gradientEnd,
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
