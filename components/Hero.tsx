import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { domains } from "@/config/domains";
import WaveGraphic from "./WaveGraphic";
import { useSettingsStore } from "@/store/settingsStore";

interface HeroProps {
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    query: string,
    domains: string,
  ) => void;
  loading: boolean;
}

export default function Hero({ handleSubmit, loading }: HeroProps) {
  const [query, setQuery] = useState("");
  const settings = useSettingsStore();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredDomainsToString = (): string => {
    const filteredDomains: string[] = [];
    settings.domains.forEach((domain, i) => {
      if (domain.enabled) {
        filteredDomains.push(domain.name);
      }
    });
    const filteredDomainsString = filteredDomains.toString();

    return filteredDomainsString;
  };

  return (
    <div className="drawer">
      <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="hero min-h-screen w-full">
          <div className="hero-content">
            <div className="flex max-w-md flex-col space-y-2">
              <h1 className="text-center text-5xl font-bold text-primary">
                AskMe Search
              </h1>
              <p className="py-6 text-center">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <form
                onSubmit={(e) =>
                  handleSubmit(e, query, filteredDomainsToString())
                }
                className="join"
              >
                <input
                  type="text"
                  placeholder="Search…"
                  onChange={(e) => handleQueryChange(e)}
                  className="input join-item input-bordered w-full"
                />
                <button type="submit" className="btn btn-square join-item">
                  {!loading ? (
                    <MagnifyingGlassIcon className="h-6 w-6" />
                  ) : (
                    <div className="loading loading-spinner"></div>
                  )}
                </button>
                <label
                  htmlFor="settings-drawer"
                  className="btn btn-square join-item drawer-button"
                >
                  <AdjustmentsHorizontalIcon className="h-6 w-6" />
                </label>
              </form>
            </div>
          </div>
          <WaveGraphic />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="settings-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
          <li>
            <h2 className="menu-title">Domain Filters</h2>
            <ul>
              {domains.map((domain, i) => {
                return (
                  <li key={i}>
                    <label className="label justify-start gap-x-4">
                      <input
                        type="checkbox"
                        checked={!!settings.domains[i].enabled}
                        onChange={() => settings.toggleDomain(i)}
                        className="checkbox checkbox-sm"
                      />
                      <span className="label-text">{domain}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Display Settings</h2>
            <ul>
              <li>
                <label className="label justify-start gap-x-4">
                  <input
                    type="checkbox"
                    checked={!!settings.devMode}
                    onChange={() => settings.toggleDevMode()}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text">Developer Mode</span>
                </label>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
