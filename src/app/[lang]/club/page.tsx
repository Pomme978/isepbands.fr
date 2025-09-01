'use client';

import PianoKeys from '@/components/club/PianoKeys';
import isepNdl from '@/assets/images/isep_ndl.png';
import Image from 'next/image';
import Roadmap from '@/components/club/Roadmap';
import purpleGuitar from '@/assets/images/instruments/purple_guitar.png';
import BgElements from '@/components/club/BgElements';
import { Button } from '@/components/ui/button';
import LangLink from '@/components/common/LangLink';
import Cabinet from '@/components/club/Cabinet';
 import { Mail } from 'lucide-react';

export default function Asso() {
  const items = [
    { title: 'Une asso du turfu' },
    { title: 'Des concerts de fou zinzin' },
    { title: 'Réunir les musicos' },
    { title: 'Retaper records' },
  ];

  const cabinetCards = [
    {
      title: 'DES JAMS',
      content: 'Venez jouez avec d’autres musiciens !',
      stack: 1,
    },
    {
      title: 'DES CONCERTS',
      content: 'Venez vivre des moment sinoubliables sur scène !!',
      stack: 2,
    },
    {
      title: 'DES SESSIONS STUDIOS',
      content: 'Venez enregistrer vos meilleures reprises avec nous !',
      stack: 3,
    },
    {
      title: 'DES AFTERWORK',
      content: 'Venez au bar rencontrez l’équipe et vous détendre après les cours !',
      stack: 2,
    },
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

        {/* Cabinet Section */}
        <div className="mx-3 md:mx-0">
          <Cabinet cards={cabinetCards} />
        </div>

        <div className="relative">
          <BgElements
            variant="circle"
            sizeClassName="w-75 h-75 absolute -left-20 -bottom-20 z-[0]"
            lineThickness="25px"
            circleGap="18%"
          />

          <BgElements
            variant="circle"
            sizeClassName="w-75 h-75 absolute -right-20 -top-25  z-[0]"
            lineThickness="25px"
            circleGap="18%"
          />
          <div
            id="adhesion"
            className="relative bg-white z-20 rounded-xl w-full flex flex-col justify-center items-center text-center py-13 mt-20 mb-20"
          >
            <h1 className="font-bold text-2xl tracking-wider">COMMENT NOUS REJOINDRE ?</h1>
            <p className="text-lg mt-3 max-w-xl">
              Rien de plus simple ! Inscris toi via le bouton rejoindre l&#39;association, remplis
              le formulaire, attends ta réponse, et tout seras prêt !
            </p>
            <span className="italic text-xs mt-1">*(Sous quelques conditions)</span>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-8 md:gap-10 max-w-7xl mx-auto mt-10 mb-6 px-4">
              <div className="flex flex-col justify-between items-center text-center max-w-60 h-96">
                <h3 className="text-xl font-bold">Savoir jouer d&#39;un instrument</h3>
                <p className="text-md">
                  Tu pratique d&#39;un instrument, quel qu&#39;il soit ? Guitare, basse, piano,
                  chant, harpe, batterie ou tout type d&#39;appareil qui produit du son? Alors isep
                  bands est fait pour toi !
                </p>
                <Button
                  asChild
                  size="sm"
                  className="relative shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground mt-8"
                >
                  <LangLink href={`/register`}>Rejoindre</LangLink>
                </Button>
              </div>

              <div className="hidden md:block w-px bg-gray-300 self-stretch my-4"></div>

              <div className="flex flex-col justify-between items-center text-center max-w-60 h-96">
                <h3 className="text-xl font-bold">Être prêt à s'engager</h3>
                <p className="text-md">
                  Tu es prêt à t'engager et à participer à la vie de l'asso ? Rejoindre un groupe,
                  monter sur scène, assurer et être présents aux répétitions ? Alors isep bands est
                  fait pour toi !
                </p>
                <Button
                  asChild
                  size="sm"
                  className="relative shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground mt-8"
                >
                  <LangLink href={`/register`}>Rejoindre</LangLink>
                </Button>
              </div>

              <div className="hidden md:block w-px bg-gray-300 self-stretch my-4"></div>

              <div className="flex flex-col justify-between items-center text-center max-w-60 h-96">
                <h3 className="text-xl font-bold">Kiffer la musique</h3>
                <p className="text-md">
                  Tu aimes la musique, tu veux découvrir le monde de la scène, des groupes, du live
                  ? Tu veux pouvoir vivre cette experience et rencontrer pleins d'autres personnes
                  qui souhaitent la même chose que toi? Alors isep bands est fait pour toi !
                </p>
                <Button
                  asChild
                  size="sm"
                  className="relative shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground mt-8"
                >
                  <LangLink href={`/register`}>Rejoindre</LangLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative bg-white z-20 rounded-xl w-[80%] mx-auto flex flex-row justify-between items-center text-center py-9 px-10 mt-20 mb-20">
            <h2 className="font-bold text-2xl tracking-wider">PRÊT À REJOINDRE L'AVENTURE ?</h2>
            <Button
              asChild
              size="sm"
              className="shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground"
            >
              <LangLink href={`/register`}>Rejoindre</LangLink>
            </Button>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-bold text-xl py-5 mb-5">En savoir plus</h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch mb-20">
            <div className="bg-white rounded-xl px-10 py-8">
              <div className="flex flex-row justify-between items-center mb-6">
                <span className="font-semibold text-lg">Notre bureau:</span>
                <Button
                  asChild
                  size="sm"
                  className="shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground"
                >
                  <LangLink href={`/team`}>Voir</LangLink>
                </Button>
              </div>
              <div className="flex flex-row justify-between items-center mb-6">
                <span className="font-semibold text-lg">Mentions légales:</span>
                <Button
                  asChild
                  size="sm"
                  className="shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground"
                >
                  <LangLink href={`/legal`}>Voir</LangLink>
                </Button>
              </div>
              <div className="flex flex-row justify-between items-center mb-6">
                <span className="font-semibold text-lg">Conditions d&#39;utilisation:</span>
                <Button
                  asChild
                  size="sm"
                  className="shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground"
                >
                  <LangLink href={`/terms`}>Voir</LangLink>
                </Button>
              </div>

              <div className="flex flex-col">
                <span className="mb-3 font-semibold text-lg">Contact Technique du site:</span>
                <div className="flex items-center justify-start gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <a 
                    href="mailto:armand@solyzon.com" 
                    className="text-primary underline"
                  >
                    armand@solyzon.com
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href="mailto:sarah@solyzon.com"
                    className="text-primary underline"
                  >
                    sarah@solyzon.com
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px bg-gray-300 self-stretch my-4"></div>
            
            <div className="bg-white rounded-xl px-10 py-8">
              <h3 className="text-xl font-bold mb-4">Sur le site</h3>
              <p className="text-justify">
                Les pages du site ont été designés et pensées par Armand OCTEAU et Sarah LÉVY.
                Chaque pages du site de la partie vitrine est conceptuelle et dite &#34; à thème&#34; . Le
                rendu final est voulu, et nous avons voulu imaginer un site à notre image, à l&#39;image
                de l&#39;association, et qui promouvoit les différences de design et l&#39;artistique. Car
                après tout, c&#39;est de ça qu&#39;il est question à Bands: l&#39;art.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
