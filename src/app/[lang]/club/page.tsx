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
    <div className="overflow-x-hidden">
      <div className="min-h-screen">
        <PianoKeys />

        <div className="flex flex-col md:flex-row justify-between items-center p-4 md:mt-40 mb-10">
          <Image
            src={isepNdl}
            alt="ISEP NDL"
            className="mt-20 md:mt-0 w-full h-auto md:w-auto md:h-100 object-contain"
          />
          <div className="bg-white w-auto max-w-sm md:max-w-120 px-6 md:px-8 py-6 md:py-9 rounded-xl flex flex-col justify-end items-start text-center md:text-right">
            <h2 className="text-2xl font-bold">
              ISEPBANDS, ASSOCIATION DE MUSIQUE DE L’ISEP DEPUIS 2013
            </h2>
            <p className="text-base mt-4 text-justify md:text-right">
              C’est en 2013 que l’association fut fondée. Elle fut la première association de
              musique de l’Isep, qui est donc maintenant la plus ancienne de l’école.
            </p>
          </div>
        </div>

        <div className="mb-20 md:mb-24">
          <Roadmap items={items} colorClass="text-slate-800" />
        </div>

        <div className="relative mx-4 md:mx-0">
          <BgElements
            variant="lines"
            sizeClassName="w-40 h-40 md:w-68 md:h-68 absolute -left-10 -top-5 md:-top-10 z-[0]"
            lineLength="125%"
            lineThickness="9%"
            lineGap="15%"
            lineAngle={60}
            mobileAngle={75}
          />
          <div className="relative bg-white z-20 rounded-xl w-full flex flex-col justify-center items-center text-center py-8 md:py-13 mt-10 md:mt-20 mb-10 md:mb-24 px-4">
            <h1 className="font-bold text-xl md:text-2xl tracking-wider">ISEPBANDS, POUR QUI?</h1>
            <p className="text-base max-w-[80%] md:max-w-full md:text-lg font-light mt-3 tracking-wider">
              Pour tout les musiciens, peu importe leur niveau.
            </p>
          </div>
          <div className="absolute -right-15 md:-right-20 top-5 md:-top-10 overflow-hidden">
            <Image
              src={purpleGuitar}
              alt="Purple Guitar"
              className={'w-42 md:w-70 h-auto relative rotate-15 md:rotate-20 z-30'}
              priority={false}
            />
          </div>
        </div>

        {/* Cabinet Section */}
        <div className="mx-3 md:mx-0 mb-16 md:mb-24">
          <Cabinet cards={cabinetCards} />
        </div>

        <div className="relative mx-4 md:mx-0 mb-20">
          <BgElements
            variant="circle"
            sizeClassName="w-48 h-48 md:w-75 md:h-75 absolute -left-5 md:-left-20 -bottom-10 md:-bottom-20 z-[0]"
            lineThickness="15px md:25px"
            circleGap="18%"
          />

          <BgElements
            variant="circle"
            sizeClassName="w-48 h-48 md:w-75 md:h-75 absolute -right-5 md:-right-20 -top-12 md:-top-25 z-[0]"
            lineThickness="15px md:25px"
            circleGap="18%"
          />
          <div
            id="adhesion"
            className="relative bg-white z-20 rounded-xl w-full flex flex-col justify-center items-center text-center py-8 md:py-13 mt-10 md:mt-20 mb-10 md:mb-20 px-4"
          >
            <h1 className="font-bold text-xl md:text-2xl tracking-wider">
              COMMENT NOUS REJOINDRE ?
            </h1>
            <p className="text-base md:text-lg mt-3 max-w-xl">
              Rien de plus simple ! Inscris toi via le bouton rejoindre l&#39;association, remplis
              le formulaire, attends ta réponse, et tout seras prêt !
            </p>
            <span className="italic text-xs mt-1">*(Sous quelques conditions)</span>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-10 max-w-7xl mx-auto mt-10 mb-6 px-4">
              <div className="flex flex-col justify-between items-center text-center w-full md:max-w-60 h-auto md:h-96 p-4 md:p-0">
                <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-0">
                  Savoir jouer d&#39;un instrument
                </h3>
                <p className="text-sm md:text-md mb-6 md:mb-0">
                  Tu pratique d&#39;un instrument, quel qu&#39;il soit ? Guitare, basse, piano,
                  chant, harpe, batterie ou tout type d&#39;appareil qui produit du son? Alors isep
                  bands est fait pour toi !
                </p>
                <Button
                  asChild
                  size="sm"
                  className="relative shadow-md overflow-hidden bg-primary text-sm py-4 md:py-5 px-8 md:px-12 text-primary-foreground w-full md:w-auto"
                >
                  <LangLink href={`/register`}>Rejoindre</LangLink>
                </Button>
              </div>

              <div className="hidden md:block w-px bg-gray-300 self-stretch"></div>

              <div className="flex flex-col justify-between items-center text-center w-full md:max-w-60 h-auto md:h-96 p-4 md:p-0">
                <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-0">
                  Être prêt à s&#39;engager
                </h3>
                <p className="text-sm md:text-md mb-6 md:mb-0">
                  Tu es prêt à t&#39;engager et à participer à la vie de l&#39;asso ? Rejoindre un
                  groupe, monter sur scène, assurer et être présents aux répétitions ? Alors isep
                  bands est fait pour toi !
                </p>
                <Button
                  asChild
                  size="sm"
                  className="relative shadow-md overflow-hidden bg-primary text-sm py-4 md:py-5 px-8 md:px-12 text-primary-foreground w-full md:w-auto"
                >
                  <LangLink href={`/register`}>Rejoindre</LangLink>
                </Button>
              </div>

              <div className="hidden md:block w-px bg-gray-300 self-stretch"></div>

              <div className="flex flex-col justify-between items-center text-center w-full md:max-w-60 h-auto md:h-96 p-4 md:p-0">
                <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-0">Kiffer la musique</h3>
                <p className="text-sm md:text-md mb-6 md:mb-0">
                  Tu aimes la musique, tu veux découvrir le monde de la scène, des groupes, du live
                  ? Tu veux pouvoir vivre cette experience et rencontrer pleins d&#39;autres
                  personnes qui souhaitent la même chose que toi? Alors isep bands est fait pour toi
                  !
                </p>
                <Button
                  asChild
                  size="sm"
                  className="relative shadow-md overflow-hidden bg-primary text-sm py-4 md:py-5 px-8 md:px-12 text-primary-foreground w-full md:w-auto"
                >
                  <LangLink href={`/register`}>Rejoindre</LangLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-4 md:mx-0 mb-16 md:mb-24">
          <div className="relative bg-white z-20 rounded-xl w-full md:w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center text-center py-6 md:py-9 px-6 md:px-10 mt-10 md:mt-20 mb-10 md:mb-20 gap-4 md:gap-0">
            <h2 className="font-bold text-xl md:text-2xl tracking-wider">
              PRÊT À REJOINDRE L&#39;AVENTURE ?
            </h2>
            <Button
              asChild
              size="sm"
              className="shadow-md overflow-hidden bg-primary text-sm py-5 px-12 text-primary-foreground"
            >
              <LangLink href={`/register`}>Rejoindre</LangLink>
            </Button>
          </div>
        </div>

        <div className="relative mx-4 md:mx-0">
          <h2 className="font-bold text-xl py-5 md:mb-3 text-center md:text-left">
            En savoir plus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch mb-10 md:mb-20">
            <div className="bg-white rounded-xl px-6 md:px-10 py-6 md:py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 md:gap-0">
                <span className="font-semibold text-md">Notre bureau:</span>
                <Button
                  asChild
                  size="sm"
                  className="shadow-md overflow-hidden bg-primary text-sm py-3 md:py-5 px-8 md:px-12 text-primary-foreground w-full md:w-auto"
                >
                  <LangLink href={`/team`}>Voir</LangLink>
                </Button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 md:gap-0">
                <span className="font-semibold text-md">Mentions légales:</span>
                <Button
                  asChild
                  size="sm"
                  className="shadow-md overflow-hidden bg-primary text-sm py-3 md:py-5 px-8 md:px-12 text-primary-foreground w-full md:w-auto"
                >
                  <LangLink href={`/legal`}>Voir</LangLink>
                </Button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 md:gap-0">
                <span className="font-semibold text-md">Conditions d&#39;utilisation:</span>
                <Button
                  asChild
                  size="sm"
                  className="shadow-md overflow-hidden bg-primary text-sm py-3 md:py-5 px-8 md:px-12 text-primary-foreground w-full md:w-auto"
                >
                  <LangLink href={`/terms`}>Voir</LangLink>
                </Button>
              </div>

              <div className="flex flex-col">
                <span className="mb-3 font-semibold text-md">Contact Technique du site:</span>
                <div className="flex items-center justify-start gap-2 mb-2">
                  <Mail className="w-4 md:w-5 h-4 md:h-5 text-primary flex-shrink-0" />
                  <a
                    href="mailto:armand@solyzon.com"
                    className="text-primary underline text-sm md:text-base break-all"
                  >
                    armand@solyzon.com
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <Mail className="w-4 md:w-5 h-4 md:h-5 text-primary flex-shrink-0" />
                  <a
                    href="mailto:sarah@solyzon.com"
                    className="text-primary underline text-sm md:text-base break-all"
                  >
                    sarah@solyzon.com
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px bg-gray-300 self-stretch my-4"></div>

            <div className="bg-white rounded-xl px-6 md:px-10 py-6 md:py-8">
              <h3 className="text-lg md:text-xl font-bold mb-4">Sur le site</h3>
              <p className="text-sm md:text-base text-justify leading-relaxed">
                Les pages du site ont été designés et pensées par Armand OCTEAU et Sarah LÉVY.
                Chaque pages du site de la partie vitrine est conceptuelle et dite &#34; à
                thème&#34; . Le rendu final est voulu, et nous avons voulu imaginer un site à notre
                image, à l&#39;image de l&#39;association, et qui promouvoit les différences de
                design et l&#39;artistique. Car après tout, c&#39;est de ça qu&#39;il est question à
                Bands: l&#39;art.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
