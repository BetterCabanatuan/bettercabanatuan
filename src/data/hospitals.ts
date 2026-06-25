import yaml from 'js-yaml';
import hospitalsYaml from './hospitals.yaml?raw';

export interface Hospital {
  name: string;
  phone: string;
  address: string;
  description?: string;
}

export interface HospitalsData {
  hospitals: Hospital[];
}

export const hospitalsData: HospitalsData = yaml.load(
  hospitalsYaml
) as HospitalsData;

export const allHospitals: Hospital[] = hospitalsData.hospitals ?? [];
