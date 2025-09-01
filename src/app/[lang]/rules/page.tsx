'use client';

import BasicLayout from '@/components/layouts/BasicLayout';
import LangLink from '@/components/common/LangLink';
import { useI18n } from '@/locales/client';
import { useSession } from '@/lib/auth-client';
import { ShieldCheck, Users, Music, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RulesPage() {
  const t = useI18n();
  const { user } = useSession();

  const rules = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Respect et bienveillance',
      description:
        "Chaque membre de l'association mérite d'être traité avec respect. Aucune forme de discrimination, harcèlement ou comportement toxique ne sera tolérée.",
      details: [
        'Adopter un langage respectueux en toutes circonstances',
        'Valoriser la diversité des profils et des niveaux musicaux',
        'Résoudre les conflits par le dialogue et la médiation',
      ],
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Engagement musical',
      description:
        "L'association promeut la passion musicale. Chaque membre s'engage à participer activement aux projets collectifs selon ses disponibilités.",
      details: [
        'Participer régulièrement aux répétitions programmées',
        "Communiquer ses indisponibilités à l'avance",
        "Contribuer à l'ambiance positive lors des sessions",
      ],
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Organisation des événements',
      description:
        "Les événements sont l'âme de notre communauté. Leur organisation demande l'implication de tous pour garantir leur succès.",
      details: [
        'Respecter les inscriptions et les deadlines',
        "Participer aux tâches d'organisation selon ses compétences",
        'Promouvoir les événements auprès de la communauté ISEP',
      ],
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Matériel et locaux',
      description:
        'Le matériel musical et les locaux sont des ressources précieuses. Chacun doit veiller à leur préservation pour les générations futures.',
      details: [
        'Utiliser le matériel avec précaution et le ranger après usage',
        'Signaler immédiatement tout dommage ou dysfonctionnement',
        'Respecter les créneaux de réservation des salles',
      ],
    },
  ];

  const sanctions = [
    {
      level: 'Avertissement',
      description: 'Premier manquement aux règles - discussion avec le bureau',
    },
    {
      level: 'Suspension temporaire',
      description: "Interdiction d'accès aux activités pour une durée définie",
    },
    {
      level: 'Exclusion définitive',
      description: 'En cas de récidive ou de manquement grave',
    },
  ];

  return (
    <BasicLayout showNavbar showFooter navbarMode="static">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold font-outfit mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight">
              Règlement de l&apos;association
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-ubuntu">
              Bienvenue dans la communauté ISEPBANDS ! Ces règles garantissent une expérience
              positive et enrichissante pour tous nos membres passionnés de musique.
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold font-outfit text-gray-900">Notre philosophie</h2>
              <p className="text-gray-600 font-ubuntu">
                Construire ensemble une communauté musicale bienveillante
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed font-ubuntu">
              ISEPBANDS est plus qu&apos;une simple association musicale : c&apos;est une famille
              qui rassemble étudiants et passionnés autour de l&apos;amour de la musique. Ces règles
              reflètent nos valeurs de respect, d&apos;entraide et d&apos;excellence artistique.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">{rule.icon}</div>
                  <h3 className="text-xl font-bold font-outfit text-gray-900">{rule.title}</h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed font-ubuntu">{rule.description}</p>
                <ul className="space-y-2">
                  {rule.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm font-ubuntu">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sanctions */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-2">
                Sanctions disciplinaires
              </h2>
              <p className="text-gray-600 font-ubuntu">Application progressive et équitable</p>
            </div>
            <div className="space-y-4">
              {sanctions.map((sanction, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-6 py-3">
                  <h4 className="font-semibold text-gray-900 mb-1">{sanction.level}</h4>
                  <p className="text-gray-600 font-ubuntu">{sanction.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 border-l-4 border-blue-400 bg-blue-50/50">
              <p className="text-gray-700 font-ubuntu">
                <strong>Note :</strong> Toute sanction est décidée collégialement par le bureau de
                l&apos;association après avoir entendu la version de la personne concernée.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-4">
                Questions ou préoccupations ?
              </h2>
              <p className="text-gray-700 mb-6 font-ubuntu">
                Notre équipe est là pour vous accompagner et répondre à toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LangLink
                  href="/team"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Contacter l&apos;équipe
                </LangLink>
                {!user && (
                  <LangLink
                    href="/register"
                    className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Music className="w-5 h-5" />
                    Rejoindre l&apos;association
                  </LangLink>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </BasicLayout>
  );
}
