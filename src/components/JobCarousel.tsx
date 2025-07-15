import React, { useRef, useEffect, useMemo, useCallback } from "react";
import JobCard from "./JobCard";
import type { Job } from "../types/job";

interface JobCarouselProps {
  jobs: Job[];
  onFavoriteToggle?: (jobId: string, isFavorite: boolean) => void;
  onLearnMore?: (jobId: string) => void;
  favoriteJobs?: ReadonlySet<string>;
}

const JobCarousel: React.FC<JobCarouselProps> = ({
  jobs,
  onFavoriteToggle,
  onLearnMore,
  favoriteJobs = new Set<string>(),
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // Memoize job cards for better performance
  const jobCards = useMemo(
    () =>
      jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onFavoriteToggle={onFavoriteToggle}
          onLearnMore={onLearnMore}
          isFavorite={favoriteJobs.has(job.id)}
        />
      )),
    [jobs, favoriteJobs, onFavoriteToggle, onLearnMore]
  );

  const handleInteractionStart = useCallback((clientX: number) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = clientX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = "grabbing";
    carouselRef.current.style.userSelect = "none";
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleInteractionStart(e.pageX);
    },
    [handleInteractionStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleInteractionStart(e.touches[0].clientX);
    },
    [handleInteractionStart]
  );

  const handleInteractionMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    const x = clientX - startXRef.current;
    carouselRef.current.scrollLeft = scrollLeftRef.current - x;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      handleInteractionMove(e.clientX);
    },
    [handleInteractionMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      handleInteractionMove(e.touches[0].clientX);
    },
    [handleInteractionMove]
  );

  const handleInteractionEnd = useCallback(() => {
    isDraggingRef.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
      carouselRef.current.style.userSelect = "";
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!carouselRef.current) return;
    const now = Date.now();

    // Throttle keyboard events
    if (now - lastScrollTimeRef.current < 100) return;
    lastScrollTimeRef.current = now;

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

  return (
    <div className="w-full" role="region" aria-label="Job listings carousel">
      <h2
        id="jobs-heading"
        className="text-left font-bold text-2xl mb-6 pl-8 font-inter text-gray-800"
      >
        Top Job Listings
      </h2>

      {jobs.length === 0 ? (
        <div className="px-8 text-gray-500">No jobs to display</div>
      ) : (
        <div
          className="w-full overflow-x-auto cursor-grab px-0 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-labelledby="jobs-heading"
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
            {jobCards}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(JobCarousel);
