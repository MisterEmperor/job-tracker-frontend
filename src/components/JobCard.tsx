import React, { useCallback, useState, useEffect } from "react";
import {
  FaRegBookmark,
  FaBookmark,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaFileContract,
} from "react-icons/fa";
import { motion } from "framer-motion";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  onFavoriteToggle?: (jobId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  onLearnMore?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onFavoriteToggle,
  isFavorite: propIsFavorite = false,
  onLearnMore,
}) => {
  const [isFavorite, setIsFavorite] = useState(propIsFavorite);
  const [timeSinceCreation, setTimeSinceCreation] = useState("");

  // Sync local state with props
  useEffect(() => {
    setIsFavorite(propIsFavorite);
  }, [propIsFavorite]);

  // Calculate time since job creation
  useEffect(() => {
    if (job.created) {
      const createdDate = new Date(job.created);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 24) {
        setTimeSinceCreation(
          `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
        );
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        setTimeSinceCreation(
          `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
        );
      }
    }
  }, [job.created]);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      onFavoriteToggle?.(job.id, newFavoriteStatus);
    },
    [job.id, isFavorite, onFavoriteToggle]
  );

  const handleContainerInteraction = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
        return;
      }
      onLearnMore?.(job.id);
    },
    [job.id, onLearnMore]
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    target.parentElement!.innerHTML = `
      <span class="
        w-full h-full flex items-center justify-center
        text-gray-400 font-bold text-lg
      ">
        ${job.company.display_name.charAt(0).toUpperCase()}
      </span>
    `;
  };

  return (
    <motion.div
      className="w-[280px] sm:w-[300px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      role="button"
      tabIndex={0}
      onClick={handleContainerInteraction}
      onKeyDown={handleContainerInteraction}
      aria-label={`View details for ${job.title} at ${job.company.display_name}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.company.display_name}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <span
                  className="
                  w-full h-full flex items-center justify-center
                  text-gray-400 font-bold text-lg
                "
                >
                  {job.company.display_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.company.display_name}
              </p>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="text-gray-400 hover:text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 rounded-full p-1"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            data-testid="favorite-button"
          >
            {isFavorite ? (
              <FaBookmark className="w-5 h-5 fill-yellow-500" />
            ) : (
              <FaRegBookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
            <span>{job.location.display_name || "Location not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMoneyBillWave className="text-gray-400 flex-shrink-0" />
            <span>
              {job.salary_min
                ? `£${job.salary_min.toLocaleString("en-GB")}${
                    job.salary_max && job.salary_max !== job.salary_min
                      ? ` - £${job.salary_max.toLocaleString("en-GB")}`
                      : ""
                  }`
                : "Salary not disclosed"}
            </span>
          </div>
          {job.contract_type && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaFileContract className="text-gray-400 flex-shrink-0" />
              <span>{job.contract_type}</span>
            </div>
          )}
          {timeSinceCreation && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-gray-400 flex-shrink-0" />
              <span>Posted {timeSinceCreation}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {job.description || "No description available"}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <motion.button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (job.redirect_url) {
                window.open(job.redirect_url, "_blank");
              } else {
                onLearnMore?.(job.id);
              }
            }}
            className="w-full bg-red-800 hover:bg-red-700 text-white font-medium text-sm px-4 py-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="view-details-button"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(JobCard);
