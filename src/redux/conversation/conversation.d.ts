export interface Message {
	_id: string;
	messageId: string;
	content: string;
	senderId: string;
	sentByMe: boolean;
	fileUrl: string[];
	isSticker: boolean;
	date: string;
}

export interface Conversation {
	_id: string;
	name: string;
	status: string;
	creName: string | null;
	messagesSeen: boolean;
	createdAt: string;
	lastMessage: string;
	lastMessageTime: string;
	sentByMe: boolean;
}
export interface Comment {
	comment: string;
	commentBy: string; // Assuming commentBy is a user ID (ObjectId as string)
	images: string[];
	timestamp: string;
	_id: string;
}
export interface CallLog {
	recipientNumber: string;
	callDuration: number | string; // Allow string format as "MM:SS"
	timestamp: string;
	callType: string;
	status: string;
}

export interface Lead {
	_id: string;
	name: string;
	phone: string[];
	source: string;
	status: string;
	messagesSeen: boolean;
	createdAt: string;
	lastMessage: string;
	pageInfo: {
		pageId: string;
		pageName: string;
		pageProfilePicture: string;
		fbSenderID?: string;
	};
	comment: Comment[];
	callLogs: CallLog[];
}

export interface Reminder {
	time: string;
	status: string;
	_id: string;
}

export interface GetAllConversationsResponse {
	totalLeads: number;
	totalPages: number;
	currentPage: number;
	leads: Conversation[];
}

export interface GetConversationMessagesResponse {
	messages: Message[];
	messagesSeen: boolean;
}

export interface GetLeadByIdResponse {
	lead: Lead;
}

export interface CreateLeadPayload {
	name: string;
	phone: string[];
	source: string;
	status?: string;
	comment?: string;
	images?: string[];
}

export interface UpdateLeadPayload {
	name?: string;
	phone?: string[]; // Array of phone numbers
	source?: 'Facebook' | 'WhatsApp' | 'Web' | 'Phone'; // Enum values for the source
	status?:
		| 'New'
		| 'No Response'
		| 'Message Rescheduled'
		| 'Need Support'
		| 'Number Collected'
		| 'Ongoing'
		| 'Call Rescheduled'
		| 'Follow Up'
		| 'Meeting Fixed'
		| 'Meeting Reschedule'
		| 'Cancel Meeting'; // Enum for status
	address?: {
		division?: string;
		district?: string;
		area?: string;
		address?: string;
	}; // Address fields
	projectStatus?: {
		status?: 'Ongoing' | 'Ready' | 'Renovation'; // Project status
		subStatus?:
			| 'Roof Casting'
			| 'Brick Wall'
			| 'Plaster'
			| 'Pudding'
			| 'Two Coat Paint'
			| 'Tiles Complete'
			| 'Final Paint Done'
			| 'Handed Over'
			| 'Staying in the Apartment'
			| 'Interior Work Complete'; // Project sub-status
	};
	projectLocation?: 'Inside' | 'Outside'; // Enum for project location
	messagesSeen?: boolean; // Boolean for messagesSeen
	requirements?: string[]; // Array of requirements
}

export interface PageInfo {
	pageId: string;
	pageName: string;
	pageProfilePicture: string;
	fbSenderID: string;
}

export interface Comment {
	comment: string;
	commentBy?: string; // ObjectId as string (optional based on existence in the data)
	images: string[];
	date: string; // Assuming it's a string (ISO format)
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface Reminder {
	time: string; // ISO format date string
	status: 'Pending' | 'Complete' | 'Missed' | 'Late Complete';
	commentId?: string;
	_id: string;
}

export interface MeetingDetail {
	date: string; // ISO format date string
	slot: 'slot_1' | 'slot_2' | 'slot_3' | 'slot_4';
	team: string; // Assuming team is an ObjectId represented as a string
}

export interface Address {
	division: string;
	district: string;
	area: string;
	address: string;
}

export interface ProjectStatus {
	status: 'Ongoing' | 'Ready' | 'Renovation';
	subStatus:
		| 'Roof Casting'
		| 'Brick Wall'
		| 'Plaster'
		| 'Pudding'
		| 'Two Coat Paint'
		| 'Tiles Complete'
		| 'Final Paint Done'
		| 'Handed Over'
		| 'Staying in the Apartment'
		| 'Interior Work Complete';
}

export interface CREName {
	_id: string;
	nameAsPerNID: string;
	nickname: string;
	profilePicture: string;
}

export interface ConversationLead {
	pageInfo: PageInfo;
	projectStatus: ProjectStatus;
	_id: string;
	CID: string;
	name: string;
	status: string;
	lastMsg: string;
	source: string;
	phone: string[];
	creName: CREName;
	messagesSeen: boolean;
	requirements: string[];
	createdAt: string;
	meetingDetails: MeetingDetail[];
	comment: Comment[];
	reminder: Reminder[];
	updatedAt: string;
	__v: number;
	address: Address;
}

export interface GetConversationByIdResponse {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	filters: {
		statuses: string[];
		sources: string[];
		creNames: {
			_id: string;
			name: string;
			nickname: string;
			profilePicture: string;
		}[];
		salesExecutives: {
			_id: string;
			name: string;
			nickname: string;
			profilePicture: string;
		}[];
	};
	leads: ConversationLead[];
}


export interface UpdateReminderPayload {
	id: string;
	time: string;
	commentId?: string;
}

export interface ReminderResponse {
	status: 'success' | 'error';
	reminders: Reminder[];
}

export interface ErrorResponse {
	status: number;
	data: {
		msg: string;
	};
}