import { carsApi } from "@/shared/api/carsApi";

export const getCars = () => {
    return carsApi.getAll();
}