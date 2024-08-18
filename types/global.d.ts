// global.d.ts
declare interface Search {
    node_types: [NodeType, "ALL"];
    area_type: "PAGE" | "SELECTION" | "ROOT_FRAME" | "SELECTION_PRESET";
    case_sensitive: boolean;
    string_match: "EXACT" | "FUZZY";
    query_text: string;
    query_submit_time: number;
    selected_nodes: SceneNode[];
}



declare interface SimpleNode {
    id: string,
    name: string,
    parent: BaseNode & ChildrenMixin,
    type: NodeType,
    selected?: boolean,
}