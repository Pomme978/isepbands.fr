'use client';

import BasicLayout from '@/components/layouts/BasicLayout';

export default function RulesPage() {
  return (
    <BasicLayout showNavbar showFooter navbarMode="static">
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Règlement de l'association</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 text-center">
              Cette page est en cours de développement.
            </p>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}