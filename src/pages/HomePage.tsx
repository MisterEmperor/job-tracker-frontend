import React, { useState, useMemo, useCallback } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { dummyCompanies } from "../types/company";
import type { Company } from "../types/company";
import type { Job } from "../types/job";
import { dummyJobs } from "../types/job";
import JobCarousel from "../components/JobCarousel";
import CompanyCarousel from "../components/CompanyCarousel";
import Footer from "../components/Footer";

const SEARCH_DEBOUNCE_DELAY = 300;
const EMPTY_RESULTS_MESSAGE = {
  title: "No results found",
  description:
    "Try adjusting your search or filter to find what you're looking for.",
};

interface FilteredData {
  filteredJobs: Job[];
  filteredCompanies: Company[];
}

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For debounced search

  // Initialize favorites more efficiently
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(() => {
    return new Set(
      dummyJobs.filter((job) => job.isFavorite).map((job) => job.id)
    );
  });

  const [favoriteCompanies, setFavoriteCompanies] = useState<Set<string>>(
    () => {
      return new Set(
        dummyCompanies
          .filter((company) => company.isFavorite)
          .map((company) => company.id)
      );
    }
  );

  // Debounced search effect
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  // Memoized filtered data with improved filtering logic
  const { filteredJobs, filteredCompanies }: FilteredData = useMemo(() => {
    if (!searchQuery) {
      return {
        filteredJobs: dummyJobs,
        filteredCompanies: dummyCompanies,
      };
    }

    const lowerQuery = searchQuery.toLowerCase();

    return {
      filteredJobs: dummyJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerQuery) ||
          job.company.toLowerCase().includes(lowerQuery) ||
          job.description.toLowerCase().includes(lowerQuery)
      ),
      filteredCompanies: dummyCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(lowerQuery) ||
          company.industry.toLowerCase().includes(lowerQuery) ||
          company.description.toLowerCase().includes(lowerQuery)
      ),
    };
  }, [searchQuery]);

  // Optimized favorite toggle handlers
  const toggleFavorite = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Set<string>>>,
      id: string,
      isFavorite: boolean
    ) => {
      setter((prev) => {
        const newSet = new Set(prev);
        isFavorite ? newSet.add(id) : newSet.delete(id);
        return newSet;
      });
    },
    []
  );

  const handleJobFavoriteToggle = useCallback(
    (jobId: string, isFavorite: boolean) => {
      toggleFavorite(setFavoriteJobs, jobId, isFavorite);
    },
    [toggleFavorite]
  );

  const handleCompanyFavoriteToggle = useCallback(
    (companyId: string, isFavorite: boolean) => {
      toggleFavorite(setFavoriteCompanies, companyId, isFavorite);
    },
    [toggleFavorite]
  );

  const handleLearnMore = useCallback((id: string, type: "job" | "company") => {
    console.log(`Viewing ${type}: ${id}`);
    // Add navigation logic here
  }, []);

  // Enhanced data with favorites
  const jobsWithFavorites = useMemo(
    () =>
      filteredJobs.map((job) => ({
        ...job,
        isFavorite: favoriteJobs.has(job.id),
      })),
    [filteredJobs, favoriteJobs]
  );

  const companiesWithFavorites = useMemo(
    () =>
      filteredCompanies.map((company) => ({
        ...company,
        isFavorite: favoriteCompanies.has(company.id),
      })),
    [filteredCompanies, favoriteCompanies]
  );

  // Search results count text
  const resultsText = useMemo(() => {
    if (!searchQuery) return null;

    const jobCount = filteredJobs.length;
    const companyCount = filteredCompanies.length;

    return (
      <p className="text-center text-sm text-gray-500 mt-2">
        Showing {jobCount} job{jobCount !== 1 ? "s" : ""} and {companyCount}{" "}
        compan
        {companyCount !== 1 ? "ies" : "y"} matching "{searchQuery}"
      </p>
    );
  }, [searchQuery, filteredJobs.length, filteredCompanies.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow px-6 md:px-20 py-10 space-y-12">
        {/* Search Section */}
        <section className="w-full space-y-6">
          <SearchBar onSearch={setSearchInput} value={searchInput} />
          {resultsText}
        </section>

        {/* Jobs Section */}
        {filteredJobs.length > 0 && (
          <section className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? "Matching Jobs" : "Featured Jobs"}
            </h2>
            <JobCarousel
              jobs={jobsWithFavorites}
              onFavoriteToggle={handleJobFavoriteToggle}
              onLearnMore={(id) => handleLearnMore(id, "job")}
            />
          </section>
        )}

        {/* Companies Section */}
        {filteredCompanies.length > 0 && (
          <section className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? "Matching Companies" : "Featured Companies"}
            </h2>
            <CompanyCarousel
              companies={companiesWithFavorites}
              onFavoriteToggle={handleCompanyFavoriteToggle}
              onLearnMore={(id) => handleLearnMore(id, "company")}
            />
          </section>
        )}

        {/* Empty State */}
        {searchQuery &&
          filteredJobs.length === 0 &&
          filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                {EMPTY_RESULTS_MESSAGE.title}
              </h3>
              <p className="text-gray-500 mt-2">
                {EMPTY_RESULTS_MESSAGE.description}
              </p>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
