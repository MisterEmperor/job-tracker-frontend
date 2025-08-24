import React, { useState, useMemo, useCallback, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import type { Company } from "../types/company";
import type { Job } from "../types/job";
import { fetchJobs } from "../services/jobService";
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
  const [searchInput, setSearchInput] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const apiQuery = searchInput.replace(/\s+/g, "_");
    fetchJobs(apiQuery)
      .then((data) => {
        setAllJobs(data);

        const companyMap = new Map<string, Company>();

        data.forEach((job) => {
          const companyId = job.company.display_name;
          if (!companyMap.has(companyId)) {
            companyMap.set(companyId, {
              id: companyId,
              display_name: job.company.display_name,
              __CLASS__: job.company.__CLASS__,
            });
          }
        });

        setAllCompanies(Array.from(companyMap.values()));
      })
      .catch((err) => console.error("Failed to fetch jobs", err));
  }, [searchQuery]);

  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set());
  const [favoriteCompanies, setFavoriteCompanies] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      // Replace spaces with underscores for API call
      const apiQuery = searchInput.replace(/\s+/g, "_");
      setSearchQuery(apiQuery);
    }, SEARCH_DEBOUNCE_DELAY);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  const { filteredJobs, filteredCompanies }: FilteredData = useMemo(() => {
    if (!searchQuery) {
      return {
        filteredJobs: allJobs,
        filteredCompanies: allCompanies,
      };
    }

    const localSearchTerm = searchQuery.replace(/_/g, " ").toLowerCase();

    return {
      filteredJobs: allJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(localSearchTerm) ||
          job.company.display_name.toLowerCase().includes(localSearchTerm) ||
          job.description.toLowerCase().includes(localSearchTerm)
      ),
      filteredCompanies: allCompanies.filter((company) =>
        company.display_name.toLowerCase().includes(localSearchTerm)
      ),
    };
  }, [searchQuery, allJobs, allCompanies]);

  const toggleFavorite = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Set<string>>>,
      id: string,
      isFavorite: boolean
    ) => {
      setter((prev) => {
        const newSet = new Set(prev);
        if (isFavorite) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
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
  }, []);

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
        isFavorite: favoriteCompanies.has(company.display_name),
      })),
    [filteredCompanies, favoriteCompanies]
  );

  const resultsText = useMemo(() => {
    if (!searchInput) return null;

    const jobCount = filteredJobs.length;
    const companyCount = filteredCompanies.length;

    if (jobCount === 0 && companyCount === 0) return null;

    return (
      <p className="text-center text-sm text-gray-500 mt-2">
        {jobCount > 0 && (
          <span>
            Showing {jobCount} job{jobCount !== 1 ? "s" : ""}
          </span>
        )}
        {jobCount > 0 && companyCount > 0 && <span> and </span>}
        {companyCount > 0 && (
          <span>
            {companyCount} compan{companyCount !== 1 ? "ies" : "y"}
          </span>
        )}
        {` matching "${searchInput}"`}
      </p>
    );
  }, [searchInput, filteredJobs.length, filteredCompanies.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow px-6 md:px-20 py-10 space-y-12">
        <section className="w-full space-y-6">
          <SearchBar onSearch={setSearchInput} value={searchInput} />
        </section>

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
            {resultsText}
          </section>
        )}

        {/*
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
        */}

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
