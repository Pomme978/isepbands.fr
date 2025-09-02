'use client';

import BasicLayout from '@/components/layouts/BasicLayout';
import { Mail, Home, Phone, User, Globe, Shield, FileText, Eye, Users, Music } from 'lucide-react';

export default function MentionsLegalesPage() {
  const currentYear = new Date().getFullYear();

  return (
    <BasicLayout navbarMode="static">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 mt-6 rounded-xl">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold font-outfit mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight">
              Mentions Légales
            </h1>
            <p className="text-xl text-gray-600 font-ubuntu max-w-2xl mx-auto">
              Informations légales concernant le site ISEP Bands
            </p>
          </div>

          <div className="space-y-12">
            {/* Section 1: Informations légales */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                1. Informations légales
              </h2>

              <div className="ml-9 space-y-6">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  Le site ISEP Bands est édité par l&apos;association étudiante ISEP Bands de
                  l&apos;ISEP, école d&apos;ingénieurs du numérique située à Paris. Ce site est
                  destiné à promouvoir les activités musicales de l&apos;association et à faciliter
                  la gestion des membres et des événements.
                </p>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold font-outfit text-primary mb-4">
                    DOMAINE ISEPBANDS.FR
                  </h3>

                  <div className="space-y-3">
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <User className="w-4 h-4 mr-3 text-primary" />
                      <span className="font-medium text-primary">
                        Président de l&apos;association:
                      </span>
                      <span className="ml-2">[À définir - {currentYear}]</span>
                    </p>

                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Home className="w-4 h-4 mr-3 text-primary" />
                      <span className="font-medium text-primary">Adresse:</span>
                      <span className="ml-2">
                        Campus de l&apos;ISEP, 28 rue Notre-Dame des Champs, 75006 Paris, France
                      </span>
                    </p>

                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-primary" />
                      <span className="font-medium text-primary">Contact:</span>
                      <a
                        href="mailto:contact@isepbands.fr"
                        className="ml-2 text-primary hover:underline"
                      >
                        contact@isepbands.fr
                      </a>
                    </p>

                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-primary" />
                      <span className="font-medium text-primary">Contact Technique:</span>
                      <a
                        href="mailto:tech@isepbands.fr"
                        className="ml-2 text-primary hover:underline"
                      >
                        tech@isepbands.fr
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Hébergement */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" />
                2. Hébergement et nom de domaine
              </h2>

              <div className="ml-9 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold font-outfit text-primary mb-4">
                    Hébergement du site
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <User className="w-4 h-4 mr-3 text-primary" />
                      [Hébergeur à définir]
                    </p>
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Home className="w-4 h-4 mr-3 text-primary" />
                      [Adresse hébergeur à définir]
                    </p>
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-primary" />
                      [Téléphone hébergeur à définir]
                    </p>
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-primary" />
                      [Email hébergeur à définir]
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold font-outfit text-primary mb-4">
                    Fournisseur du domaine
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Globe className="w-4 h-4 mr-3 text-primary" />
                      [Registrar à définir]
                    </p>
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Home className="w-4 h-4 mr-3 text-primary" />
                      [Adresse registrar à définir]
                    </p>
                    <p className="text-gray-800 font-ubuntu flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-primary" />
                      [Téléphone registrar à définir]
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Équipe */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                3. Conception et développement
              </h2>

              <div className="ml-9 space-y-4">
                <p className="text-gray-800 font-ubuntu flex items-center">
                  <User className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-medium text-primary">Président de l&apos;association:</span>
                  <span className="ml-2">[Président {currentYear} à définir]</span>
                </p>

                <p className="text-gray-800 font-ubuntu flex items-center">
                  <User className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-medium text-primary">Responsable communication:</span>
                  <span className="ml-2">[À définir]</span>
                </p>

                <p className="text-gray-800 font-ubuntu flex items-center">
                  <User className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-medium text-primary">Développement technique:</span>
                  <span className="ml-2">[Équipe dev à définir]</span>
                </p>

                <p className="text-gray-800 font-ubuntu flex items-center">
                  <User className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-medium text-primary">Design et UX:</span>
                  <span className="ml-2">[Équipe design à définir]</span>
                </p>
              </div>
            </section>

            {/* Section 4: Propriété intellectuelle */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                4. Propriété intellectuelle
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  ISEP Bands est propriétaire des droits de propriété intellectuelle ou détient les
                  droits d&apos;usage sur tous les éléments accessibles sur le site isepbands.fr,
                  notamment les textes, images, graphismes, logo, icônes, sons, logiciels. Toute
                  reproduction, représentation, modification, publication, adaptation de tout ou
                  partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
                  interdite, sauf autorisation écrite préalable de l&apos;association ISEP Bands.
                  Toute exploitation non autorisée du site ou de l&apos;un quelconque des éléments
                  qu&apos;il contient sera considérée comme constitutive d&apos;une contrefaçon et
                  poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code
                  de Propriété Intellectuelle.
                </p>
              </div>
            </section>

            {/* Section 5: Protection des données */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-primary" />
                5. Protection des données personnelles
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  En France, les données personnelles sont notamment protégées par la loi n° 78-87
                  du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l&apos;article L. 226-13 du
                  Code pénal et le Règlement Général sur la Protection des Données (RGPD). À
                  l&apos;occasion de l&apos;utilisation du site isepbands.fr, peuvent être
                  recueillies : l&apos;URL des liens par l&apos;intermédiaire desquels
                  l&apos;utilisateur a accédé au site, le fournisseur d&apos;accès de
                  l&apos;utilisateur, l&apos;adresse de protocole Internet (IP) de
                  l&apos;utilisateur. L&apos;association ISEP Bands ne collecte des informations
                  personnelles relatives à l&apos;utilisateur que pour le besoin de certains
                  services proposés par le site isepbands.fr. L&apos;utilisateur fournit ces
                  informations en toute connaissance de cause, notamment lorsqu&apos;il procède par
                  lui-même à leur saisie. Conformément aux dispositions du RGPD, tout utilisateur
                  dispose d&apos;un droit d&apos;accès, de rectification et d&apos;opposition aux
                  données personnelles le concernant, en effectuant sa demande par email à
                  l&apos;adresse contact@isepbands.fr. Aucune information personnelle de
                  l&apos;utilisateur du site isepbands.fr n&apos;est publiée à l&apos;insu de
                  l&apos;utilisateur, échangée, transférée, cédée ou vendue sur un support
                  quelconque à des tiers.
                </p>
              </div>
            </section>

            {/* Section 6: Liens et cookies */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" />
                6. Liens hypertextes et cookies
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
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
            </section>

            {/* Section 7: Activités musicales */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Music className="w-6 h-6 mr-3 text-primary" />
                7. Contenus relatifs aux activités musicales
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  Les informations sur les événements musicaux, les groupes et les activités
                  présentés sur ISEP Bands sont collectées et vérifiées par les membres de
                  l&apos;association. Bien que nous nous efforcions de garantir l&apos;exactitude
                  des données, elles sont fournies à titre indicatif et peuvent évoluer sans
                  préavis. L&apos;utilisateur reste responsable de vérifier ces informations avant
                  toute participation aux événements.
                </p>
              </div>
            </section>

            {/* Section 8: Crédits */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-primary" />
                8. Crédits photographiques
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  Les crédits photographiques des images utilisées sur le site seront ajoutés
                  ultérieurement. Toutes les images sont soit la propriété exclusive d&apos;ISEP
                  Bands, soit utilisées avec autorisation. Toute reproduction ou utilisation non
                  autorisée est interdite.
                </p>
              </div>
            </section>

            {/* Section 9: Limitation de responsabilité */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                9. Limitation de responsabilité
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  Le site isepbands.fr est fourni dans le cadre des activités associatives
                  d&apos;ISEP Bands. L&apos;association ne pourra être tenue responsable des
                  dommages directs et indirects causés au matériel de l&apos;utilisateur, lors de
                  l&apos;accès au site, et résultant soit de l&apos;utilisation d&apos;un matériel
                  ne répondant pas aux spécifications techniques requises, soit de l&apos;apparition
                  d&apos;un bug ou d&apos;une incompatibilité. ISEP Bands ne pourra également être
                  tenue responsable des dommages indirects consécutifs à l&apos;utilisation du site.
                  ISEP Bands se réserve le droit de supprimer, sans mise en demeure préalable, tout
                  contenu déposé qui contreviendrait à la législation applicable en France, en
                  particulier aux dispositions relatives à la protection des données.
                </p>
              </div>
            </section>

            {/* Section 10: Droit applicable */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                10. Droit applicable et attribution de juridiction
              </h2>

              <div className="ml-9">
                <p className="text-gray-700 font-ubuntu text-justify leading-relaxed">
                  Tout litige en relation avec l&apos;utilisation du site isepbands.fr est soumis au
                  droit français. Il est fait attribution exclusive de juridiction aux tribunaux
                  compétents de Paris.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-600 font-ubuntu">
              Pour toutes questions concernant ces mentions légales, veuillez-vous référer aux
              informations de contact fournies ci-dessus.
            </p>
            <p className="text-sm text-gray-500 font-ubuntu mt-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}
