import { domains } from "@/config/domains";
import { termsPerDocument, termsPerDocumentSet } from "@/config/settings";
import { create } from "zustand";

interface SettingsState {
  domains: DomainSetting[];
  toggleDomain: (index: number) => void;
  devMode: boolean;
  toggleDevMode: () => void;
  termsPerDocument: number;
  setTermsPerDocument: (count: number) => void;
  termsPerDocumentSet: number;
  setTermsPerDocumentSet: (count: number) => void;
}

interface DomainSetting {
  name: string;
  enabled: boolean;
}

const getInitialDomains = () => {
  const initialDomains: DomainSetting[] = domains.map((domain) => {
    return {
      name: domain,
      enabled: false,
    };
  });
  return initialDomains;
};

export const useSettingsStore = create<SettingsState>()((set) => ({

  domains: getInitialDomains(),
  toggleDomain: (index: number) =>
    set((state) => ({
      domains: [
        ...state.domains.slice(0, index),
        {
          name: state.domains[index].name,
          enabled: !state.domains[index].enabled,
        },
        ...state.domains.slice(index + 1),
      ],
    })),

  devMode: false,
  toggleDevMode: () =>
    set((state) => ({
      devMode: !state.devMode,
    })),

  termsPerDocument: termsPerDocument,
  setTermsPerDocument: (count: number) =>
    set((state) => ({
      termsPerDocument: count,
    })),

  termsPerDocumentSet: termsPerDocumentSet,
  setTermsPerDocumentSet: (count: number) =>
    set((state) => ({
      termsPerDocumentSet: count,
    })),

}));
