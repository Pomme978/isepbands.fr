'use client';

import PianoKeys from '@/components/club/PianoKeys';
import isepNdl from '@/assets/images/isep_ndl.png';
import Image from 'next/image';
import Roadmap from "@/components/club/Roadmap";

export default function Asso() {
  const items = [
    { title: "Une asso du turfu" },
    { title: "Des concerts de fou zinzin" },
    { title: "Réunir les musicos" },
    { title: "Retaper records" },
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
          <div className="bg-white w-auto max-w-100 p-6 rounded-xl flex flex-col justify-end items-start text-center md:text-right">
            <h2 className="text-2xl font-bold">
              ISEPBANDS, ASSOCIATION DE MUSIQUE DE L’ISEP DEPUIS 2013
            </h2>
            <p className="text-base mt-4 text-justify md:text-right">
              C’est en 2013, que l’association fu fondé. Elle fut la première asso de musique de
              l’isep blahblah blah jsp quoi dire. bref. on a capté l’idée.
            </p>
          </div>
        </div>

        <Roadmap items={items} colorClass="text-slate-900" />

      </div>
    </div>
  );
}
