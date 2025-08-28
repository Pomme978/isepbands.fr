'use client';

import PianoKeys from '@/components/club/PianoKeys';
import isepNdl from '@/assets/images/isep_ndl.png';
import Image from 'next/image';
import Roadmap from '@/components/club/Roadmap';
import purpleGuitar from '@/assets/images/instruments/purple_guitar.png';
import BgElements from '@/components/club/BgElements';

export default function Asso() {
  const items = [
    { title: 'Une asso du turfu' },
    { title: 'Des concerts de fou zinzin' },
    { title: 'Réunir les musicos' },
    { title: 'Retaper records' },
  ];
  return (
    <div>
      <div className="min-h-screen">
        <PianoKeys />

        <div className="flex flex-col md:flex-row justify-between items-center p-4 md:mt-40">
          <Image
            src={isepNdl}
            alt="ISEP NDL"
            className="mt-20 md:mt-0 w-full h-auto md:w-auto md:h-100 object-contain"
          />
          <div className="bg-white w-auto max-w-120 px-8 py-9 rounded-xl flex flex-col justify-end items-start text-center md:text-right">
            <h2 className="text-2xl font-bold">
              ISEPBANDS, ASSOCIATION DE MUSIQUE DE L’ISEP DEPUIS 2013
            </h2>
            <p className="text-base mt-4 text-justify md:text-right">
              C’est en 2013, que l’association fu fondé. Elle fut la première asso de musique de
              l’isep blahblah blah jsp quoi dire. bref. on a capté l’idée.
            </p>
          </div>
        </div>

        <Roadmap items={items} colorClass="text-slate-800" />

        <div className="relative">
          <BgElements
            variant="lines"
            sizeClassName="w-68 h-68 absolute -left-10 -top-10 z-[0]"
            lineLength="120%"
            lineThickness="9%"
            lineGap="15%"
            lineAngle={60}
          />
          <div className="relative bg-white z-20 rounded-xl w-full flex flex-col justify-center items-center text-center py-13 mt-20 mb-20">
            <h1 className="font-bold text-2xl tracking-wider">ISEPBANDS, POUR QUI?</h1>
            <p className="text-lg font-light mt-3 tracking-wider">
              Pour tout les musiciens, peu importe leur niveau
            </p>
          </div>
          <div className="absolute -right-20 -top-10">
            <Image
              src={purpleGuitar}
              alt="Purple Guitar"
              className={'w-70 h-auto relative rotate-20 z-30'}
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
