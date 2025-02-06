import { PatientSearch } from "./PatientSearch";
import { StaffAdvancedSearch, StaffSearch } from "./StaffSearch";

  // Exportando o componente que encapsula todas as opções de busca
export const SearchBar = {
    Patient: PatientSearch,
    Staff: StaffSearch,
    StaffAdvanced: StaffAdvancedSearch
};