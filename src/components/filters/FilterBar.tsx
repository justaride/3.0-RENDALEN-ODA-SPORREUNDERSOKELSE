'use client';

import { useState } from 'react';
import { useFilterStore } from '@/lib/store/filterStore';
import { getSurveyData } from '@/lib/data/loader';
import { countSingleChoice } from '@/lib/utils/dataProcessing';
import { AGE_ORDER, LOCATION_ORDER } from '@/lib/types/survey';

export function FilterBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    filters,
    setAgeFilter,
    setGenderFilter,
    setLocationFilter,
    setHouseholdTypeFilter,
    setEconomicCapacityFilter,
    clearFilters,
    hasActiveFilters,
  } = useFilterStore();

  const surveyData = getSurveyData();
  const allResponses = surveyData.sheets[0].responses;

  // Get unique values for each filter
  const ageCounts = countSingleChoice(
    allResponses.map(r => r.data.demografi.hva_er_din_alder)
  );
  const ageOptions = AGE_ORDER.filter(age => ageCounts[age]);

  const genderCounts = countSingleChoice(
    allResponses.map(r => r.data.demografi.kjønn)
  );
  const genderOptions = Object.keys(genderCounts);

  const locationCounts = countSingleChoice(
    allResponses.map(r => r.data.diverse.hvor_i_rendalen_kommune_bor_du)
  );
  const locationOptions = LOCATION_ORDER.filter(loc => locationCounts[loc]);

  const householdCounts = countSingleChoice(
    allResponses.map(r => r.data.demografi.hvordan_ser_din_husstand_ut)
  );
  const householdOptions = Object.keys(householdCounts);

  const purchaseCounts = countSingleChoice(
    allResponses.map(r => r.data.okonomi.dersom_du_skulle_kjøpe_bolig_hva_er_din_anslåtte_maksimale_kjøpesumbyggekostnad)
  );
  const purchaseOrder: Record<string, number> = {
    'Under 2 mill': 1,
    '2-3 mill': 2,
    '3-4 mill': 3,
    '4-5 mill': 4,
    'Over 5 mill': 5,
    'Vet ikke': 6,
  };
  const economicOptions = Object.keys(purchaseCounts).sort((a, b) => {
    const orderA = purchaseOrder[a] ?? 99;
    const orderB = purchaseOrder[b] ?? 99;
    return orderA - orderB;
  });

  const handleCheckboxChange = (
    category: 'age' | 'gender' | 'location' | 'householdType' | 'economicCapacity',
    value: string,
    isChecked: boolean
  ) => {
    const currentValues = filters[category];
    let newValues: string[];

    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    switch (category) {
      case 'age':
        setAgeFilter(newValues);
        break;
      case 'gender':
        setGenderFilter(newValues);
        break;
      case 'location':
        setLocationFilter(newValues);
        break;
      case 'householdType':
        setHouseholdTypeFilter(newValues);
        break;
      case 'economicCapacity':
        setEconomicCapacityFilter(newValues);
        break;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-medium">Filtrer data</span>
          </button>
          {hasActiveFilters() && (
            <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
              Aktive filtre
            </span>
          )}
        </div>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Nullstill alle filtre
          </button>
        )}
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Age Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Alder</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ageOptions.map((age) => (
                <label key={age} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.age.includes(age)}
                    onChange={(e) => handleCheckboxChange('age', age, e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{age}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Kjønn</h4>
            <div className="space-y-2">
              {genderOptions.map((gender) => (
                <label key={gender} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.gender.includes(gender)}
                    onChange={(e) => handleCheckboxChange('gender', gender, e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Område</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locationOptions.map((location) => (
                <label key={location} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.location.includes(location)}
                    onChange={(e) => handleCheckboxChange('location', location, e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Household Type Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Husstandstype</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {householdOptions.map((household) => (
                <label key={household} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.householdType.includes(household)}
                    onChange={(e) => handleCheckboxChange('householdType', household, e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{household}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Economic Capacity Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Kjøpekraft</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {economicOptions.map((option) => (
                <label key={option} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.economicCapacity.includes(option)}
                    onChange={(e) => handleCheckboxChange('economicCapacity', option, e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
