export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  description: string;
  location: string;
  salary: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote';
  isFavorite?: boolean;
}

export const dummyJobs: Job[] = [
  {
    id: "1",
    title: 'Frontend Developer',
    company: 'Tech Corp',
    description: 'Build modern UIs with React and Tailwind.',
    location: 'Remote',
    salary: '$70,000 - $90,000',
    type: 'Full-Time',
    logo: ""
  },
  {
    id: "2",
    title: 'Backend Engineer',
    company: 'CloudBase',
    description: 'Design robust APIs and services using Node.js.',
    location: 'New York, NY',
    salary: '$80,000 - $110,000',
    type: 'Full-Time',
    logo: ""
  },
  {
    id: "3",
    title: 'Frontend Developer',
    company: 'Tech Corp',
    description: 'Build modern UIs with React and Tailwind.',
    location: 'Remote',
    salary: '$70,000 - $90,000',
    type: 'Full-Time',
    logo: ""
  },
  {
    id: "4",
    title: 'Backend Engineer',
    company: 'CloudBase',
    description: 'Design robust APIs and services using Node.js.',
    location: 'New York, NY',
    salary: '$80,000 - $110,000',
    type: 'Full-Time',
    logo: ""
  },
  {
    id: "5",
    title: 'Frontend Developer',
    company: 'Tech Corp',
    description: 'Build modern UIs with React and Tailwind.',
    location: 'Remote',
    salary: '$70,000 - $90,000',
    type: 'Full-Time',
    logo: ""
  },
  {
    id: "6",
    title: 'Backend Engineer',
    company: 'CloudBase',
    description: 'Design robust APIs and services using Node.js.',
    location: 'New York, NY',
    salary: '$80,000 - $110,000',
    type: 'Full-Time',
    logo: ""
  },
];
