'use client';

import { useI18n } from '@/locales/client';
import BasicLayout from '@/components/layouts/BasicLayout';
import { Shield, Eye, Users, Lock, Mail, Server } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const t = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <BasicLayout navbarMode="static">
      <div className="min-h-screen mt-6">
        <div className="flex justify-center flex-col items-center">
          <div className="mx-8 md:max-w-4xl text-left">
            <h1 className="text-primary text-3xl text-center my-10 font-bold font-outfit">
              Politique de Confidentialité
            </h1>

            <div className="space-y-8">
              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  1. Collecte des informations
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    ISEP Bands collecte des informations lorsque vous vous inscrivez sur notre site, 
                    vous abonnez à notre newsletter, participez à nos événements ou remplissez un formulaire.
                  </p>
                  <p className="text-black text-md text-justify font-ubuntu">
                    Les informations collectées incluent votre nom, adresse e-mail, numéro de téléphone, 
                    promotion, instruments pratiqués, niveau de compétence et préférences musicales.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Eye className="w-6 h-6 mr-2" />
                  2. Utilisation des informations
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Les informations que nous collectons peuvent être utilisées pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="text-black text-md font-ubuntu">Gérer votre compte utilisateur</li>
                    <li className="text-black text-md font-ubuntu">Organiser des événements musicaux</li>
                    <li className="text-black text-md font-ubuntu">Former des groupes musicaux</li>
                    <li className="text-black text-md font-ubuntu">Vous envoyer des newsletters</li>
                    <li className="text-black text-md font-ubuntu">Améliorer notre site web</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Lock className="w-6 h-6 mr-2" />
                  3. Protection des informations
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous mettons en place diverses mesures de sécurité pour préserver la sécurité de vos 
                    informations personnelles. Nous utilisons un cryptage sécurisé pour protéger les 
                    informations sensibles transmises en ligne.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  4. Partage des informations
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles 
                    identifiables à des tiers sans votre consentement, sauf pour fournir les services 
                    que vous avez demandés.
                  </p>
                  <p className="text-black text-md text-justify font-ubuntu">
                    Cela ne comprend pas les tiers de confiance qui nous aident à exploiter notre site 
                    web ou à vous servir, tant que ces parties acceptent de garder ces informations confidentielles.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Server className="w-6 h-6 mr-2" />
                  5. Cookies
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Nous utilisons des cookies pour améliorer votre expérience, recueillir des informations 
                    générales sur les visiteurs et suivre les visites sur notre site web.
                  </p>
                  <p className="text-black text-md text-justify font-ubuntu">
                    Vous pouvez choisir de désactiver les cookies via les paramètres de votre navigateur. 
                    Cependant, cela peut affecter votre capacité à utiliser certaines fonctionnalités du site.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit flex items-center">
                  <Mail className="w-6 h-6 mr-2" />
                  6. Désinscription
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Vous pouvez vous désinscrire de nos communications à tout moment en utilisant 
                    le lien de désinscription présent dans tous nos e-mails ou en nous contactant 
                    directement.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  7. Consentement
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    En utilisant notre site, vous consentez à notre politique de confidentialité.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-primary text-xl my-6 font-outfit">
                  8. Modifications de la politique
                </h2>
                <div className="ml-4 space-y-4">
                  <p className="text-black text-md text-justify font-ubuntu">
                    Si nous décidons de changer notre politique de confidentialité, nous publierons 
                    ces changements sur cette page. Cette politique a été modifiée pour la dernière fois le{' '}
                    {new Date().toLocaleDateString('fr-FR')}.
                  </p>
                </div>
              </section>
            </div>

            <div className="text-center my-10">
              <p className="text-black text-md font-ubuntu">
                Pour toutes questions concernant cette politique de confidentialité, 
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