import axiosClient from "../api/axiosClient";

export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

export const getProperties = async (): Promise<Property[]> => {
  const res = await axiosClient.get<Property[]>("/properties");
  return res.data;
};
