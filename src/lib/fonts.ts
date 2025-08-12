import localFont from 'next/font/local';

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
