import apiSlice from '../api/apiSlice';

// Define interfaces for Department and Role
interface Department {
	_id: string;
	departmentName: string;
}

interface Role {
	roleId: string;
	roleName: string;
}

// Define the User interface
interface User {
	_id: string;
	nameAsPerNID: string;
	nickname: string;
	email: string;
	personalPhone: string;
	officePhone: string;
	gender: string;
	address: string;
	profilePicture?: string;
	coverPhoto?: string;
	status: string;
	role?: Role; // Optional populated role information
	department?: Department; // Optional populated department information
}

// Interface for creating a new user
interface CreateUserPayload {
	nameAsPerNID: string;
	nickname: string;
	email: string;
	personalPhone: string;
	officePhone: string;
	gender: 'Male' | 'Female' | 'Other'; // Gender as a union type
	address: string;
	password: string;
	roleId: string; // Role ID string
	departmentId: string; // Department ID string
	accessLevel: string[]; // Array of access levels (e.g., ['Admin'])
	currentSalary: number; // Salary as a number
	workingProcedure: string; // Working procedure as a string
	profilePicture?: string; // Profile picture URL (optional)
	coverPhoto?: string; // Cover photo URL (optional)
	documents: {
		resume?: string; // Resume file URL (optional)
		nidCopy?: string; // NID copy file URL (optional)
		academicDocument?: string; // Academic document file URL (optional)
		bankAccountNumber?: string; // Bank account number as string (optional)
		agreement?: string; // Agreement document file URL (optional)
	};
	socialLinks: {
		facebook?: string; // Facebook link (optional)
		instagram?: string; // Instagram link (optional)
		whatsapp?: string; // WhatsApp link (optional)
	};
	guardian: {
		name: string; // Guardian name
		phone: string; // Guardian phone number
		relation: string; // Relation with the guardian
	};
	type: 'Admin' | 'Operator'; // Type must be either 'Admin' or 'Operator'
}

// Interface for user creation response
interface CreateUserResponse {
	msg: string;
	user: User;
}

interface LoginResponse {
	user: User;
	token: string;
}

interface UpdateUserResponse {
	msg: string;
	user: User;
}

interface UpdatePasswordPayload {
	oldPassword: string;
	newPassword: string;
}

interface UpdateProfilePicturePayload {
	profilePicture: string;
}

interface UpdateCoverPhotoPayload {
	coverPhoto: string;
}

interface UpdateStatusPayload {
	status: string;
}

// Interface for getting user by ID response
interface GetUserByIdResponse {
	_id: string;
	nameAsPerNID: string;
	email: string;
	personalPhone: string;
	gender: string;
	status: string;
	department?: Department;
	role?: Role;
	profilePicture?: string;
	coverPhoto?: string;
}

// Interface for fetching all users
interface GetAllUsersResponse {
	// An array of User objects with populated role and department
	users: User[];
}

const authApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		// User login
		loginUser: builder.mutation<
			LoginResponse,
			{ email: string; password: string }
		>({
			query: ({ email, password }) => {
				console.log('redux--->',email,password)
				return{
				url: '/users/login',
				method: 'POST',
				body: { email, password },
				credentials: 'include',
			}},
		}),

		// User logout
		logoutUser: builder.mutation<{ msg: string }, void>({
			query: () => ({
				url: '/users/logout',
				method: 'POST',
			}),
		}),

		// Fetch all users
		getAllUsers: builder.query<GetAllUsersResponse, void>({
			query: () => '/users',
		}),

		// Get single user by ID
		getUserById: builder.query<GetUserByIdResponse, string>({
			query: id => `/users/${id}`,
		}),

		// Create a new user
		createUser: builder.mutation<CreateUserResponse, CreateUserPayload>({
			query: userData => ({
				url: '/users',
				method: 'POST',
				body: userData,
			}),
		}),

		// Update user details
		updateUser: builder.mutation<
			UpdateUserResponse,
			{ id: string; userData: Partial<User> }
		>({
			query: ({ id, userData }) => ({
				url: `/users/${id}`,
				method: 'PUT',
				body: userData,
			}),
		}),

		// Update user password
		updateUserPassword: builder.mutation<
			{ msg: string },
			{ id: string; data: UpdatePasswordPayload }
		>({
			query: ({ id, data }) => ({
				url: `/users/${id}/password`,
				method: 'PATCH',
				body: data,
			}),
		}),

		// Admin update user password
		adminUpdateUserPassword: builder.mutation<
			{ msg: string },
			{ id: string; newPassword: string }
		>({
			query: ({ id, newPassword }) => ({
				url: `/users/admin/${id}/password`,
				method: 'PATCH',
				body: { newPassword },
			}),
		}),

		// Update user profile picture
		updateUserProfilePicture: builder.mutation<
			{ msg: string; profilePicture: string },
			{ id: string; data: UpdateProfilePicturePayload }
		>({
			query: ({ id, data }) => ({
				url: `/users/${id}/profile-picture`,
				method: 'PATCH',
				body: data,
			}),
		}),

		// Update user cover photo
		updateUserCoverPhoto: builder.mutation<
			{ msg: string; coverPhoto: string },
			{ id: string; data: UpdateCoverPhotoPayload }
		>({
			query: ({ id, data }) => ({
				url: `/users/${id}/cover-photo`,
				method: 'PATCH',
				body: data,
			}),
		}),

		// Update user status
		updateUserStatus: builder.mutation<
			{ msg: string; status: string },
			{ id: string; data: UpdateStatusPayload }
		>({
			query: ({ id, data }) => ({
				url: `/users/${id}/status`,
				method: 'PATCH',
				body: data,
			}),
		}),
	}),
});

// Export hooks for each endpoint
export const {
	useLoginUserMutation,
	useLogoutUserMutation,
	useGetAllUsersQuery,
	useGetUserByIdQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useUpdateUserPasswordMutation,
	useAdminUpdateUserPasswordMutation,
	useUpdateUserProfilePictureMutation,
	useUpdateUserCoverPhotoMutation,
	useUpdateUserStatusMutation,
} = authApi;

export default authApi;
