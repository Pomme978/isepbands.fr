import { NextRequest, NextResponse } from 'next/server';
import { standardAuth } from '@/utils/authMiddleware';
import { logAdminAction } from '@/services/activityLogService';
import fs from 'fs';
import path from 'path';

// CSS Color variables that can be customized
interface CSSColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primaryForeground: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}

// Default CSS colors from globals.css
const defaultColors: CSSColors = {
  primary: 'oklch(0.559 0.238 307.331)',
  secondary: 'oklch(0.28 0.125 292.671)',
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  primaryForeground: 'oklch(0.985 0 0)',
  secondaryForeground: 'oklch(0.205 0 0)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  accent: 'oklch(0.97 0 0)',
  accentForeground: 'oklch(0.205 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: 'oklch(0.708 0 0)',
};

// GET /api/admin/colors - Get current CSS colors
export async function GET(request: NextRequest) {
  const authResult = await standardAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check admin permissions
  if (!user.isFullAccess && !user.isRoot) {
    return NextResponse.json({ error: 'Permissions administrateur requises' }, { status: 403 });
  }

  try {
    const colors = getCurrentCSSColors();
    return NextResponse.json({ colors });
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des couleurs' },
      { status: 500 },
    );
  }
}

// PUT /api/admin/colors - Update CSS colors
export async function PUT(request: NextRequest) {
  const authResult = await standardAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check admin permissions
  if (!user.isFullAccess && !user.isRoot) {
    return NextResponse.json({ error: 'Permissions administrateur requises' }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Partial<CSSColors>;

    // Validate OKLCH color format for each provided color
    const oklchRegex = /^oklch\([\d.]+\s+[\d.]+\s+[\d.]+\)$/;
    
    for (const [key, value] of Object.entries(body)) {
      if (value && !oklchRegex.test(value)) {
        return NextResponse.json(
          { error: `Format de couleur OKLCH invalide pour ${key}: ${value}` },
          { status: 400 },
        );
      }
    }

    // Update CSS file with new colors
    await updateCSSColors(body);

    // Log admin action
    await logAdminAction(
      user.id,
      'system_settings_updated',
      'Couleurs du thème modifiées',
      `Couleurs CSS modifiées par **${user.firstName} ${user.lastName}**`,
      null,
      {
        changes: Object.keys(body),
        newValues: body,
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Couleurs mises à jour avec succès',
      colors: getCurrentCSSColors()
    });
  } catch (error) {
    console.error('Error updating colors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des couleurs' },
      { status: 500 },
    );
  }
}

// Function to read current CSS colors from globals.css
function getCurrentCSSColors(): CSSColors {
  try {
    const cssPath = path.join(process.cwd(), 'src/styles/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const colors: CSSColors = { ...defaultColors };
    
    // Extract colors from CSS content
    const rootMatch = cssContent.match(/:root\s*\{([^}]+)\}/s);
    if (rootMatch) {
      const rootContent = rootMatch[1];
      
      // Parse each CSS variable
      Object.keys(colors).forEach((key) => {
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase(); // camelCase to kebab-case
        const regex = new RegExp(`--${cssVar}:\\s*([^;]+);`);
        const match = rootContent.match(regex);
        if (match) {
          colors[key as keyof CSSColors] = match[1].trim();
        }
      });
    }
    
    return colors;
  } catch (error) {
    console.error('Error reading CSS colors:', error);
    return defaultColors;
  }
}

// Function to update CSS colors in globals.css
async function updateCSSColors(colors: Partial<CSSColors>) {
  try {
    const cssPath = path.join(process.cwd(), 'src/styles/globals.css');
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Update each provided color
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase(); // camelCase to kebab-case
        const regex = new RegExp(`(--${cssVar}:\\s*)[^;]+(;)`);
        const replacement = `$1${value}$2`;
        
        if (regex.test(cssContent)) {
          cssContent = cssContent.replace(regex, replacement);
        } else {
          // If variable doesn't exist, add it to :root
          cssContent = cssContent.replace(
            /:root\s*\{/,
            `:root {\n  --${cssVar}: ${value};`
          );
        }
      }
    });
    
    fs.writeFileSync(cssPath, cssContent, 'utf8');
  } catch (error) {
    console.error('Error updating CSS colors:', error);
    throw error;
  }
}