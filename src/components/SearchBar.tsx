import React, { useState, useMemo, useCallback, useEffect } from "react";
import jobSearchImage from "../assets/images/ExampleJobImage.png";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string, location?: string) => void;
  value?: string;
  isLoading?: boolean;
  onLocationChange?: (location: string) => void;
  locationValue?: string;
}

// Extracted styles for maintainability
const styles = {
  input: `w-full py-[1.1em] pl-5 pr-12 text-base font-sans text-[#111827] border border-gray-300 rounded-lg bg-white placeholder-[#9ca3af] shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:black focus:border-transparent hover:border-gray-400 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`,
  suggestionButton: (active: boolean) => `
    relative px-5 py-2.5 rounded-full text-sm font-medium 
    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
    overflow-hidden cursor-pointer flex-shrink-0 border
    ${
      active
        ? "bg-red-800 text-white shadow-lg border-transparent"
        : "bg-white text-gray-700 hover:bg-red-700 hover:text-white border-gray-200"
    }
  `,
};

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 transition-transform duration-300 hover:scale-110"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const SuggestionButton = ({
  label,
  isActive,
  onClick,
  onHover,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onHover: (label: string | null) => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onMouseEnter={() => onHover(label)}
    onMouseLeave={() => onHover(null)}
    onClick={onClick}
    className={styles.suggestionButton(isActive)}
    aria-label={`Search for ${label}`}
    aria-pressed={isActive}
  >
    <span className="relative z-10 transition-all duration-200">{label}</span>
    {isActive && (
      <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200 rounded-full" />
    )}
    {!isActive && (
      <span className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full" />
    )}
  </motion.button>
);

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [input, setInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(
    null
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, onSearch]);

  const suggestions = useMemo(
    () => ["Remote jobs", "Software Engineer", "Entry level"],
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      if (value !== activeSuggestion) {
        setActiveSuggestion(null);
      }
    },
    [activeSuggestion]
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      if (activeSuggestion === text) {
        setInput("");
        setActiveSuggestion(null);
      } else {
        setInput(text);
        setActiveSuggestion(text);
      }
    },
    [activeSuggestion]
  );

  const clearSearch = useCallback(() => {
    setInput("");
    setActiveSuggestion(null);
  }, []);

  return (
    <div
      className="flex flex-row flex-wrap gap-10 px-6 sm:px-8 lg:px-16 max-w-[1440px] mx-auto py-6 sm:py-8 lg:py-16 items-start"
      role="search"
      aria-label="Job search"
    >
      {/* Left Side */}
      <div className="flex-1 min-w-[300px] flex flex-col gap-6 lg:pr-8">
        <h1 className="text-left font-extrabold text-[#02050f] leading-[1.2] mb-2 text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[5.5rem]">
          Find your <br /> dream job
        </h1>

        <p className="text-left text-gray-600 text-[1rem] sm:text-[1.1rem] md:text-[1.25rem] leading-[1.6] max-w-full md:max-w-[80%]">
          Search for thousands of jobs across top companies
        </p>

        <div className="relative w-full max-w-[600px]">
          <input
            type="text"
            placeholder="Search job titles or companies"
            value={input}
            onChange={handleInputChange}
            className={styles.input}
            aria-label="Search job titles or companies"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            {input && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <SearchIcon />
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-left text-gray-500 text-base tracking-wide pl-3 mb-2 font-medium">
            Try these searches for jobs hiring now:
          </p>

          {/* Suggestion Buttons */}
          <div className="flex flex-wrap items-start gap-3">
            {suggestions.map((label) => (
              <SuggestionButton
                key={label}
                label={label}
                isActive={activeSuggestion === label}
                onClick={() => handleSuggestionClick(label)}
                onHover={setHoveredSuggestion}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 min-w-[300px] flex items-center justify-center">
        {!isImageLoaded && (
          <div className="w-full max-w-[500px] h-[300px] bg-gray-100 rounded-xl animate-pulse" />
        )}
        <motion.img
          src={jobSearchImage}
          alt="Job Search"
          className={`w-full max-w-[500px] h-auto object-contain rounded-xl mix-blend-darken ${
            isImageLoaded ? "block" : "hidden"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(false)}
        />
      </div>
    </div>
  );
};

export default React.memo(SearchBar);
