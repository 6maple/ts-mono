export interface VscodePluginConfig {
  /**
   * 格式化命令
   */
  formatters?: {
    selectors?: string[];
    stdoutAsResult?: boolean;
    commands?: string[];
  }[];
  /**
   * 可视化
   */
  visualizer?: {
    includePatterns?: string[];
    excludePatterns?: string[];
    ignoreMember?: boolean;
    direction?: string;
  };
}

export const EVENT_TYPE = {
  classData: 'classData',
  refresh: 'refresh',
} as const;

export interface EventDataClassData {
  type: (typeof EVENT_TYPE)['classData'];
  refreshKey: string;
  value: ClassDataValue;
}

export interface ClassDataValue {
  title: string;
  config: VscodePluginConfig;
  classList: ClassItem[];
}

export interface ClassItem {
  note?: string;
  className: string;
  properties?: {
    const?: boolean;
    memberType: ClassItemMemberType;
    name: string;
    type: ClassItemValueType;
    note?: string;
  }[];
  methods?: {
    memberType: ClassItemMemberType;
    name: string;
    parameters: { name: string; type: string }[];
    returnType: ClassItemValueType;
    note?: string;
  }[];
  related?: ClassRelationshipItem[];
}

export interface ClassRelationshipItem {
  classItem: ClassItem;
  relationshipType:
    | 'Inheritance'
    | 'Composition'
    | 'Aggregation'
    | 'Association'
    | 'Dependency'
    | 'Realization'
    | 'LinkSolid'
    | 'LinkDashed';
  note?: string;
}

export type ClassItemMemberType = {
  public?: boolean;
  private?: boolean;
  protected?: boolean;
  static?: boolean;
  abstract?: boolean;
};

export type ClassItemValueType = string;

export interface EventDataRefresh {
  type: (typeof EVENT_TYPE)['refresh'];
  refreshKey: string;
}
