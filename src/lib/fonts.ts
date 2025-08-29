import localFont from 'next/font/local';
import { Monoton, Press_Start_2P } from 'next/font/google';

export const moranga = localFont({
  src: [
    {
      path: '../assets/fonts/Moranga/Moranga_Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Light_It.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Regular_It.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Medium_It.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Bold_It.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Moranga/Moranga_Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-moranga',
});

export const outfit = localFont({
  src: [
    {
      path: '../assets/fonts/Outfit/Outfit-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Outfit/Outfit-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-outfit',
});

export const ubuntu = localFont({
  src: [
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Ubuntu/Ubuntu-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-ubuntu',
});

export const deliciousHandrawn = localFont({
  src: [
    {
      path: '../assets/fonts/DeliciousHandrawn/DeliciousHandrawn-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-handrawn',
});

export const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-monoton',
});

export const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
});

export const impact = localFont({
  src: [
    {
      path: '../assets/fonts/Impact/impact.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Impact/Impacted.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Impact/unicode.impact.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-impact',
});
