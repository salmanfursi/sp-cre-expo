import apiSlice from "../../api/apiSlice";

 
// Define types for the data structures
interface Division {
	_id: string;
	division: string;
}

interface District {
	_id: string;
	name: string;
}

interface Area {
	_id: string;
	name: string;
}

interface SearchLocation {
	_id: string;
	name: string;
	path: string;
	divisionId?: string;
	districtId?: string;
	type: 'division' | 'district' | 'area';
}

const mapApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		// Fetch all divisions
		getDivisions: builder.query<Division[], void>({
			query: () => '/map/divisions',
		}),

		// Fetch districts by division ID
		getDistrictsByDivision: builder.query<District[], string>({
			query: (divisionId: string) => `/map/${divisionId}/districts`,
		}),

		// Fetch areas by district ID
		getAreasByDistrict: builder.query<Area[], string>({
			query: (districtId: string) => `/map/${districtId}/areas`,
		}),

		// Search for locations by keyword
		searchLocation: builder.query<SearchLocation[], string>({
			query: (keyword: string) => `/map/search?keyword=${keyword}`,
		}),
	}),
});

// Export hooks for using the endpoints in components
export const {
	useGetDivisionsQuery,
	useGetDistrictsByDivisionQuery,
	useGetAreasByDistrictQuery,
	useSearchLocationQuery,
} = mapApi;

export default mapApi;
