'use client';

import { useI18n } from '@/locales/client';
import BasicLayout from '@/components/layouts/BasicLayout';
import { FileText, Users, AlertTriangle, Scale, Shield, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  const t = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <BasicLayout navbarMode="static">
      <div className="min-h-screen mt-6">
        <div className="flex justify-center flex-col items-center">
          <div className="mx-8 md:max-w-4xl text-left">
            <h1 className="text-primary text-3xl text-center my-10 font-bold font-outfit">
              Conditions Générales d'Utilisation
            </h1>

            <div className="space-y-8">
              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  1. Acceptation des conditions
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    En accédant et en utilisant le site web d'ISEP Bands, vous acceptez d'être lié par 
                    ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, 
                    veuillez ne pas utiliser notre site.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  2. Utilisation du service
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Le service ISEP Bands est destiné aux étudiants et membres de la communauté ISEP 
                    pour faciliter les activités musicales, la formation de groupes et l'organisation d'événements.
                  </p>
                  <p className="text-black text-md text-justify font-ubuntu">
                    Vous vous engagez à utiliser le service de manière responsable et conforme aux règles 
                    de l'école et de l'association.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  3. Compte utilisateur
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Pour utiliser certaines fonctionnalités du site, vous devez créer un compte. 
                    Vous êtes responsable de :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="text-black text-md font-ubuntu">Maintenir la confidentialité de vos identifiants</li>
                    <li className="text-black text-md font-ubuntu">Toutes les activités effectuées sous votre compte</li>
                    <li className="text-black text-md font-ubuntu">Signaler immédiatement tout usage non autorisé</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  4. Conduite interdite
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Il est interdit d'utiliser le service pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="text-black text-md font-ubuntu">Publier du contenu offensant, discriminatoire ou illégal</li>
                    <li className="text-black text-md font-ubuntu">Harceler ou intimider d'autres utilisateurs</li>
                    <li className="text-black text-md font-ubuntu">Violer les droits de propriété intellectuelle</li>
                    <li className="text-black text-md font-ubuntu">Tenter de compromettre la sécurité du système</li>
                    <li className="text-black text-md font-ubuntu">Utiliser le service à des fins commerciales non autorisées</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  5. Contenu utilisateur
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Vous conservez les droits sur le contenu que vous publiez, mais vous accordez à 
                    ISEP Bands une licence pour utiliser ce contenu dans le cadre du service.
                  </p>
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous nous réservons le droit de supprimer tout contenu qui viole ces conditions 
                    ou qui est jugé inapproprié.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  6. Disponibilité du service
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous nous efforçons de maintenir le service accessible, mais nous ne garantissons 
                    pas une disponibilité continue. Le service peut être interrompu pour maintenance, 
                    mises à jour ou raisons techniques.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Scale className="w-6 h-6 mr-2" />
                  7. Limitation de responsabilité
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    ISEP Bands ne peut être tenu responsable des dommages directs ou indirects 
                    résultant de l'utilisation du service, y compris la perte de données, 
                    les interruptions de service ou les erreurs.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  8. Modifications des conditions
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous nous réservons le droit de modifier ces conditions à tout moment. 
                    Les modifications seront publiées sur cette page et entreront en vigueur immédiatement.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  9. Résiliation
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous nous réservons le droit de suspendre ou résilier votre compte en cas 
                    de violation de ces conditions. Vous pouvez également fermer votre compte 
                    à tout moment.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  10. Droit applicable
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Ces conditions sont régies par le droit français. Tout litige sera soumis 
                    aux tribunaux compétents de Paris.
                  </p>
                </div>
              </section>
            </div>

            <div className="text-center my-10">
              <p className="text-black text-md font-ubuntu">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
              <p className="text-black text-md font-ubuntu mt-4">
                Pour toutes questions concernant ces conditions, 
                veuillez nous contacter à{' '}
                <a href="mailto:contact@isepbands.fr" className="text-primary hover:underline">
                  contact@isepbands.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}