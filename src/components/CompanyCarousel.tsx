import React, { useRef, useEffect, useCallback, useMemo } from "react";
import CompanyCard from "./CompanyCard";
import type { Company } from "../types/company";

interface CompaniesCarouselProps {
  companies: Company[];
  onFavoriteToggle?: (companyId: string, isFavorite: boolean) => void;
  onLearnMore?: (companyId: string) => void;
  favoriteCompanies?: ReadonlySet<string>;
}

const CompaniesCarousel: React.FC<CompaniesCarouselProps> = ({
  companies,
  onFavoriteToggle,
  onLearnMore,
  favoriteCompanies = new Set<string>(),
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = "grabbing";
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - startXRef.current;
    carouselRef.current.scrollLeft = scrollLeftRef.current - x;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - startXRef.current;
    carouselRef.current.scrollLeft = scrollLeftRef.current - x;
  }, []);

  const handleInteractionEnd = useCallback(() => {
    isDraggingRef.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    if (e.key === "ArrowLeft") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const options = { passive: false };
    carousel.addEventListener("mousemove", handleMouseMove, options);
    carousel.addEventListener("touchmove", handleTouchMove, options);
    carousel.addEventListener("mouseup", handleInteractionEnd);
    carousel.addEventListener("touchend", handleInteractionEnd);
    carousel.addEventListener("mouseleave", handleInteractionEnd);

    return () => {
      carousel.removeEventListener("mousemove", handleMouseMove);
      carousel.removeEventListener("touchmove", handleTouchMove);
      carousel.removeEventListener("mouseup", handleInteractionEnd);
      carousel.removeEventListener("touchend", handleInteractionEnd);
      carousel.removeEventListener("mouseleave", handleInteractionEnd);
    };
  }, [handleMouseMove, handleTouchMove, handleInteractionEnd]);

  const companyCards = useMemo(
    () =>
      companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onFavoriteToggle={onFavoriteToggle}
          onLearnMore={onLearnMore}
          isFavorite={favoriteCompanies.has(company.id)}
        />
      )),
    [companies, favoriteCompanies, onFavoriteToggle, onLearnMore]
  );

  return (
    <div className="w-full" role="region" aria-label="Companies carousel">
      <h2
        id="companies-heading"
        className="text-left font-bold text-2xl mb-6 pl-8 font-inter text-gray-800"
      >
        Top Companies
      </h2>

      {companies.length === 0 ? (
        <div className="px-8 text-gray-500">No companies to display</div>
      ) : (
        <div
          className="w-full overflow-x-auto cursor-grab px-0 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-labelledby="companies-heading"
        >
          <div
            className="flex gap-6 sm:gap-8 px-8 pb-6 flex-nowrap"
            style={
              {
                "--carousel-item-width": "280px",
                "--carousel-item-width-sm": "300px",
              } as React.CSSProperties
            }
          >
            {companyCards}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesCarousel;
