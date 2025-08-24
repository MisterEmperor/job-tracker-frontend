export interface LocationOption {
  value: string;
  label: string;
}

export interface LocationGroup {
  group: string;
  options: LocationOption[];
}

export type LocationItem = LocationOption | LocationGroup;

export const UK_LOCATIONS: LocationItem[] = [
  { value: "", label: "All Locations" },
  { value: "remote", label: "Remote" },
  { 
    group: "Popular Locations",
    options: [
      { value: "london", label: "London" },
      { value: "manchester", label: "Manchester" },
      { value: "birmingham", label: "Birmingham" },
      { value: "leeds", label: "Leeds" },
      { value: "glasgow", label: "Glasgow" },
      { value: "edinburgh", label: "Edinburgh" },
      { value: "bristol", label: "Bristol" },
      { value: "liverpool", label: "Liverpool" },
    ]
  },
  {
    group: "Regions",
    options: [
      { value: "east-midlands", label: "East Midlands" },
      { value: "east-of-england", label: "East of England" },
      { value: "north-east", label: "North East" },
      { value: "north-west", label: "North West" },
      { value: "south-east", label: "South East" },
      { value: "south-west", label: "South West" },
      { value: "west-midlands", label: "West Midlands" },
      { value: "yorkshire", label: "Yorkshire and the Humber" },
    ]
  },
  {
    group: "Ireland",
    options: [
      { value: "dublin", label: "Dublin" },
      { value: "cork", label: "Cork" },
      { value: "galway", label: "Galway" },
      { value: "limerick", label: "Limerick" },
      { value: "waterford", label: "Waterford" },
      { value: "belfast", label: "Belfast" },
    ]
  }
];