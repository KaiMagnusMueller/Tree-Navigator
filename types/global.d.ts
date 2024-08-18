// global.d.ts
declare global {
    interface Search {
        node_types: SearchNodeTypes;
        area_type: "PAGE" | "SELECTION" | "ROOT_FRAME" | "SELECTION_PRESET";
        case_sensitive: boolean;
        string_match: "EXACT" | "FUZZY";
        query_text: string;
        query_submit_time: number;
        selected_nodes?: string[];
    }

    type SearchNodeTypes = [NodeType | "ALL"];

    interface SimpleNode {
        id: string;
        name: string;
        parent: BaseNode & ChildrenMixin;
        type: NodeType;
        selected?: boolean;
    }
}

export { };