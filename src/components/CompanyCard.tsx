import React, { useCallback, useState, useEffect } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Company } from "../types/company";

interface CompanyCardProps {
  company: Company;
  onFavoriteToggle?: (companyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  onLearnMore?: (companyId: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onFavoriteToggle,
  isFavorite: propIsFavorite = false,
  onLearnMore,
}) => {
  const [isFavorite, setIsFavorite] = useState(propIsFavorite);

  useEffect(() => {
    setIsFavorite(propIsFavorite);
  }, [propIsFavorite]);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      onFavoriteToggle?.(company.id, newFavoriteStatus);
    },
    [company.id, isFavorite, onFavoriteToggle]
  );

  // Modified to handle both click and keyboard events
  const handleContainerInteraction = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
        return;
      }
      onLearnMore?.(company.id);
    },
    [company.id, onLearnMore]
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    target.parentElement!.innerHTML = `
      <span class="
        w-full h-full flex items-center justify-center
        text-gray-400 font-bold text-lg
      ">
        ${company.name.charAt(0).toUpperCase()}
      </span>
    `;
  };

  return (
    <motion.div
      className="w-[280px] sm:w-[300px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
      role="button"
      tabIndex={0}
      onClick={handleContainerInteraction}
      onKeyDown={handleContainerInteraction}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              ) : (
                <span
                  className="
                  w-full h-full flex items-center justify-center
                  text-gray-400 font-bold text-lg
                "
                >
                  {company.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.industry}</p>
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

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {company.description || "No description available"}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <motion.button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onLearnMore?.(company.id);
            }}
            className="w-full bg-red-800 hover:bg-red-700 text-white font-medium text-sm px-4 py-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="view-company-button"
          >
            View Company
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
