'use client';

import { UserFormData } from '../CreateUserModal';
import { formatPhoneInput, cleanPhoneNumber } from '@/utils/phoneUtils';

interface Step1PersonalProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

export default function Step1Personal({ formData, setFormData }: Step1PersonalProps) {
  const updateField = (field: keyof UserFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneInput(value);
    updateField('phone', formatted);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="user@eleve.isep.fr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="+33 6 12 34 56 78"
              maxLength={20} // Allow for longer international numbers
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => updateField('birthDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ISEP Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion *</label>
            <select
              value={formData.promotion}
              onChange={(e) => updateField('promotion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Select promotion</option>
              <option value="P1">P1 - Prépa intégrée 1ère année</option>
              <option value="P2">P2 - Prépa intégrée 2ème année</option>
              <option value="I1">I1 - Cycle intégré 1ère année</option>
              <option value="I2">I2 - Cycle intégré 2ème année</option>
              <option value="A1">A1 - Cycle ingénieur 1ère année</option>
              <option value="A2">A2 - Cycle ingénieur 2ème année</option>
              <option value="A3">A3 - Cycle ingénieur 3ème année</option>
              <option value="B1">B1 - Bachelor 1ère année</option>
              <option value="B2">B2 - Bachelor 2ème année</option>
              <option value="B3">B3 - Bachelor 3ème année</option>
              <option value="Graduate">Graduate - Diplômé</option>
              <option value="Former">Former - Ancien étudiant (non diplômé)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Required Fields</h4>
        <p className="text-sm text-blue-700">
          Fields marked with * are required. Make sure to fill in at least the first name, last
          name, email, and promotion before proceeding to the next step.
        </p>
      </div>
    </div>
  );
}
