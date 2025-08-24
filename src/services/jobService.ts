import axios from "axios";
import type { Job } from "../types/job";

export const fetchJobs = async (query?: string): Promise<Job[]> => {
  const url = query 
    ? `http://localhost:8080/api/jobs/adzuna?query=${encodeURIComponent(query)}`
    : "http://localhost:8080/api/jobs/adzuna";
  const response = await axios.get(url);
  return response.data;
  
};