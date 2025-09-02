'use client';

import { useState, useEffect } from 'react';
import BasicLayout from '@/components/layouts/BasicLayout';
import { Mail, Home, Phone, User, Globe, Eye, Users } from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface LegalMentions {
  presidentName: string;
  contactEmail: string;
  technicalEmail: string;
  hostingProvider?: string;
  hostingAddress?: string;
  hostingPhone?: string;
  hostingEmail?: string;
  domainProvider?: string;
  domainAddress?: string;
  domainPhone?: string;
  developmentTeam?: string;
  designTeam?: string;
}

export default function MentionsLegalesPage() {
  const currentYear = new Date().getFullYear();
  const [legalData, setLegalData] = useState<LegalMentions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLegalMentions = async () => {
      try {
        const response = await fetch('/api/admin/legal-mentions');
        if (response.ok) {
          const data = await response.json();
          setLegalData(data);
        }
      } catch (error) {
        console.error('Error loading legal mentions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLegalMentions();
  }, []);

  if (loading) {
    return (
      <BasicLayout navbarMode="static">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 mt-6 rounded-xl">
          <div className="flex justify-center items-center h-96">
            <Loading text="Chargement des mentions légales..." size="lg" />
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout navbarMode="static">
      <div className="min-h-screen mt-6">
        <div className="flex justify-center flex-col items-center">
          <div className="mx-8 md:max-w-3xl text-center">
            <h1 className="text-primary text-3xl text-center my-10 font-bold font-outfit">
              Mentions Légales
            </h1>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              1. Informations légales
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                Le site ISEP Bands est édité par l&apos;association étudiante ISEP Bands de
                l&apos;ISEP, école d&apos;ingénieurs du numérique située à Paris. Ce site est
                destiné à promouvoir les activités musicales de l&apos;association et à faciliter la
                gestion des membres et des événements.
              </p>

              <h3 className="text-primary text-md text-left my-3 font-outfit">
                DOMAINE ISEPBANDS.FR
              </h3>

              <p className="text-black text-md text-justify my-1 font-ubuntu">
                <User className="text-primary text-md mr-2 inline w-4 h-4" />
                <span className="text-primary">Président de l&apos;association:</span>{' '}
                {legalData?.presidentName || `[Président ${currentYear} à définir]`}
              </p>

              <p className="text-black text-md text-left my-1 font-ubuntu">
                <Home className="text-primary text-md mr-2 inline w-4 h-4" />
                <span className="text-primary">Adresse:</span> Campus de l&apos;ISEP, 28 rue
                Notre-Dame des Champs, 75006 Paris, France
              </p>

              <p className="text-black text-md text-left my-1 font-ubuntu">
                <Mail className="text-primary text-md mr-2 inline w-4 h-4" />
                <span className="text-primary">Contact Pro:</span>{' '}
                <a
                  href={`mailto:${legalData?.contactEmail || 'contact@isepbands.fr'}`}
                  className="hover:underline"
                >
                  {legalData?.contactEmail || 'contact@isepbands.fr'}
                </a>
              </p>

              <p className="text-black text-md text-left my-1 font-ubuntu">
                <Mail className="text-primary text-md mr-2 inline w-4 h-4" />
                <span className="text-primary">Contact Technique:</span>{' '}
                <a
                  href={`mailto:${legalData?.technicalEmail || 'tech@isepbands.fr'}`}
                  className="hover:underline"
                >
                  {legalData?.technicalEmail || 'tech@isepbands.fr'}
                </a>
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              2. Hébergement et nom de domaine
            </h2>

            <div className="ml-3">
              <h3 className="text-primary text-md text-left mt-4 font-outfit">
                Hébergement du site
              </h3>

              <p className="text-black text-md text-justify my-1 font-ubuntu">
                <User className="text-primary text-md mr-2 inline w-4 h-4" />
                {legalData?.hostingProvider || '[Hébergeur à définir]'}
              </p>

              {legalData?.hostingAddress && (
                <p className="text-black text-md text-left my-1 font-ubuntu">
                  <Home className="text-primary text-md mr-2 inline w-4 h-4" />
                  {legalData.hostingAddress}
                </p>
              )}

              {legalData?.hostingPhone && (
                <p className="text-black text-md text-left my-1 font-ubuntu">
                  <Phone className="text-primary text-md mr-2 inline w-4 h-4" />
                  {legalData.hostingPhone}
                </p>
              )}

              {legalData?.hostingEmail && (
                <p className="text-black text-md text-left my-1 font-ubuntu">
                  <Mail className="text-primary text-md mr-2 inline w-4 h-4" />
                  <a href={`mailto:${legalData.hostingEmail}`} className="hover:underline">
                    {legalData.hostingEmail}
                  </a>
                </p>
              )}

              <h3 className="text-primary text-md text-left mt-4 font-outfit">
                Fournisseur du domaine
              </h3>

              <p className="text-black text-md text-justify my-1 font-ubuntu">
                <Globe className="text-primary text-md mr-2 inline w-4 h-4" />
                {legalData?.domainProvider || '[Registrar à définir]'}
              </p>

              {legalData?.domainAddress && (
                <p className="text-black text-md text-left my-1 font-ubuntu">
                  <Home className="text-primary text-md mr-2 inline w-4 h-4" />
                  {legalData.domainAddress}
                </p>
              )}

              {legalData?.domainPhone && (
                <p className="text-black text-md text-left my-1 font-ubuntu">
                  <Phone className="text-primary text-md mr-2 inline w-4 h-4" />
                  {legalData.domainPhone}
                </p>
              )}
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              3. Conception et développement
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify my-1 font-ubuntu">
                <User className="text-primary text-md mr-2 inline w-4 h-4" />
                <span className="text-primary">Président de l&apos;association:</span>{' '}
                {legalData?.presidentName || `[Président ${currentYear} à définir]`}
              </p>

              {legalData?.developmentTeam && (
                <p className="text-black text-md text-justify my-1 font-ubuntu">
                  <Users className="text-primary text-md mr-2 inline w-4 h-4" />
                  <span className="text-primary">Équipe développement:</span>{' '}
                  {legalData.developmentTeam}
                </p>
              )}

              {legalData?.designTeam && (
                <p className="text-black text-md text-justify my-1 font-ubuntu">
                  <Eye className="text-primary text-md mr-2 inline w-4 h-4" />
                  <span className="text-primary">Design et UX:</span> {legalData.designTeam}
                </p>
              )}
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              4. Propriété intellectuelle
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                ISEP Bands est propriétaire des droits de propriété intellectuelle ou détient les
                droits d&apos;usage sur tous les éléments accessibles sur le site isepbands.fr,
                notamment les textes, images, graphismes, logo, icônes, sons, logiciels. Toute
                reproduction, représentation, modification, publication, adaptation de tout ou
                partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
                interdite, sauf autorisation écrite préalable de l&apos;association ISEP Bands.
                Toute exploitation non autorisée du site ou de l&apos;un quelconque des éléments
                qu&apos;il contient sera considérée comme constitutive d&apos;une contrefaçon et
                poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de
                Propriété Intellectuelle.
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              5. Protection des données personnelles
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                En France, les données personnelles sont notamment protégées par la loi n° 78-87 du
                6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l&apos;article L. 226-13 du Code
                pénal et le Règlement Général sur la Protection des Données (RGPD). À
                l&apos;occasion de l&apos;utilisation du site isepbands.fr, peuvent être recueillies
                : l&apos;URL des liens par l&apos;intermédiaire desquels l&apos;utilisateur a accédé
                au site, le fournisseur d&apos;accès de l&apos;utilisateur, l&apos;adresse de
                protocole Internet (IP) de l&apos;utilisateur. L&apos;association ISEP Bands ne
                collecte des informations personnelles relatives à l&apos;utilisateur que pour le
                besoin de certains services proposés par le site isepbands.fr. L&apos;utilisateur
                fournit ces informations en toute connaissance de cause, notamment lorsqu&apos;il
                procède par lui-même à leur saisie. Conformément aux dispositions du RGPD, tout
                utilisateur dispose d&apos;un droit d&apos;accès, de rectification et
                d&apos;opposition aux données personnelles le concernant, en effectuant sa demande
                par email à l&apos;adresse contact@isepbands.fr. Aucune information personnelle de
                l&apos;utilisateur du site isepbands.fr n&apos;est publiée à l&apos;insu de
                l&apos;utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque
                à des tiers.
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              6. Liens hypertextes et cookies
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                Le site isepbands.fr contient un certain nombre de liens hypertextes vers
                d&apos;autres sites, mis en place avec l&apos;autorisation d&apos;ISEP Bands.
                Cependant, ISEP Bands n&apos;a pas la possibilité de vérifier le contenu des sites
                ainsi visités, et n&apos;assumera en conséquence aucune responsabilité de ce fait.
                La navigation sur le site isepbands.fr est susceptible de provoquer
                l&apos;installation de cookie(s) sur l&apos;ordinateur de l&apos;utilisateur. Un
                cookie est un fichier de petite taille, qui ne permet pas l&apos;identification de
                l&apos;utilisateur, mais qui enregistre des informations relatives à la navigation
                d&apos;un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la
                navigation ultérieure sur le site, et ont également vocation à permettre diverses
                mesures de fréquentation. Le refus d&apos;installation d&apos;un cookie peut
                entraîner l&apos;impossibilité d&apos;accéder à certains services.
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              7. Contenus relatifs aux activités musicales
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                Les informations sur les événements musicaux, les groupes et les activités présentés
                sur ISEP Bands sont collectées et vérifiées par les membres de l&apos;association.
                Bien que nous nous efforcions de garantir l&apos;exactitude des données, elles sont
                fournies à titre indicatif et peuvent évoluer sans préavis. L&apos;utilisateur reste
                responsable de vérifier ces informations avant toute participation aux événements.
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              8. Crédits photographiques
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                Les crédits photographiques des images utilisées sur le site seront ajoutés
                ultérieurement. Toutes les images sont soit la propriété exclusive d&apos;ISEP
                Bands, soit utilisées avec autorisation. Toute reproduction ou utilisation non
                autorisée est interdite.
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              9. Limitation de responsabilité
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                Le site isepbands.fr est fourni dans le cadre des activités associatives d&apos;ISEP
                Bands. L&apos;association ne pourra être tenue responsable des dommages directs et
                indirects causés au matériel de l&apos;utilisateur, lors de l&apos;accès au site, et
                résultant soit de l&apos;utilisation d&apos;un matériel ne répondant pas aux
                spécifications techniques requises, soit de l&apos;apparition d&apos;un bug ou
                d&apos;une incompatibilité. ISEP Bands ne pourra également être tenue responsable
                des dommages indirects consécutifs à l&apos;utilisation du site. ISEP Bands se
                réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé
                qui contreviendrait à la législation applicable en France, en particulier aux
                dispositions relatives à la protection des données.
              </p>
            </div>

            <h2 className="text-primary text-xl text-left my-3 mt-10 font-outfit">
              10. Droit applicable et attribution de juridiction
            </h2>

            <div className="ml-3">
              <p className="text-black text-md text-justify font-ubuntu">
                Tout litige en relation avec l&apos;utilisation du site isepbands.fr est soumis au
                droit français. Il est fait attribution exclusive de juridiction aux tribunaux
                compétents de Paris.
              </p>
            </div>

            <p className="text-black text-md text-center my-10 font-ubuntu">
              Pour toutes questions, veuillez-vous référer aux informations fournies plus-haut.
            </p>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}
