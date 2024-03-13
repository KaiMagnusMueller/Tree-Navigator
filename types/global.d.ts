// global.d.ts
declare interface Search {
	node_types: string[];
	area_type: string;
	case_sensitive: boolean;
	string_match: string;
	query_text: string;
	query_submit_time: number;
}
