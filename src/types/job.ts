import type {Company} from "../types/company"
import type {Location} from "../types/location"

export interface Job {
  id: string;
  title: string;
  description: string;
  created: string;
  salary_min: number;
  salary_max: number;
  salary_is_predicted: string;
  contract_type: string;
  redirect_url: string;
  adref: string;
  latitude: number;
  longitude: number;
  company: Company;
  location: Location;
  logo: string;
  isFavourite?: boolean;
}