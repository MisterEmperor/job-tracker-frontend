export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  jobs?: number;
  isFavorite?: boolean;
}

export const dummyCompanies: Company[] = [
  {
    id: "1",
    name: "TechCorp",
    logo: "https://logo.clearbit.com/techcorp.com",
    industry: "Technology",
    description: "A leading technology company specializing in AI and cloud computing solutions. We innovate to make the world more connected and efficient.",
    jobs: 124,
  },
  {
    id: "2",
    name: "GreenEnergy",
    logo: "https://logo.clearbit.com/greenenergy.com",
    industry: "Renewable Energy",
    description: "Pioneers in sustainable energy solutions, providing solar and wind power installations worldwide for a cleaner future.",
    jobs: 87,
  },
  {
    id: "3",
    name: "HealthPlus",
    logo: "https://logo.clearbit.com/healthplus.com",
    industry: "Healthcare",
    description: "Innovative healthcare provider offering cutting-edge medical solutions and telemedicine services across the globe.",
    jobs: 215,
  },
  {
    id: "4",
    name: "Finova",
    logo: "https://logo.clearbit.com/finova.com",
    industry: "Financial Services",
    description: "Digital banking and financial services company revolutionizing how people manage their money with mobile-first solutions.",
    jobs: 76,
  },
  {
    id: "5",
    name: "EduFuture",
    logo: "https://logo.clearbit.com/edufuture.com",
    industry: "Education",
    description: "Transforming education through online learning platforms and interactive tools for students of all ages worldwide.",
    jobs: 53,
  },
  {
    id: "6",
    name: "FoodExpress",
    logo: "https://logo.clearbit.com/foodexpress.com",
    industry: "Food Delivery",
    description: "Fast and reliable food delivery service connecting restaurants with customers through our innovative platform.",
    jobs: 142,
  }
];