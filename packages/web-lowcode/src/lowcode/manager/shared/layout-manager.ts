export type LayoutAreaType = ValueOf<typeof LAYOUT_AREA_TYPE>;
export const LAYOUT_AREA_TYPE = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

export type LayoutAreaPanelType = ValueOf<typeof LAYOUT_AREA_PANEL_TYPE>;
export const LAYOUT_AREA_PANEL_TYPE = {
  FULL: 'full',
  CENTER: 'center',
  TOP: 'top',
  Bottom: 'bottom',
} as const;

export interface LayoutArea {
  name: string;
  type: LayoutAreaType;
  panelList: LayoutAreaPanel[];
}

export type TypeToLayoutArea = Partial<Record<LayoutAreaType, LayoutArea[]>>;

export interface LayoutAreaPanel {
  name: string;
  title: string | (() => string);
  type: LayoutAreaPanelType;
  renderElement: (
    previousValue: HTMLElement | null,
    parent: HTMLElement,
    first: boolean,
  ) => HTMLElement;
}

export const createLayoutManager = () => {
  const areaRecord: TypeToLayoutArea = {};
  const getAreaRecord = () => {
    return areaRecord;
  };
  const addArea = (value: LayoutArea) => {
    const { type } = value;
    let item = areaRecord[type];
    if (!item) {
      item = [value];
      areaRecord[type] = item;
    } else {
      item.push(value);
    }
  };
  return {
    areaRecord,
    getAreaRecord,
    addArea,
    resolveGroupedAreaPanelList,
  };
};

export type LayoutManager = ReturnType<typeof createLayoutManager>;

export type GroupedAreaPanelList = Record<
  LayoutAreaPanelType,
  LayoutAreaPanel[]
>;

export const resolveGroupedAreaPanelList = (area: LayoutArea) => {
  const { panelList } = area;
  const groupedPanelList = panelList.reduce((acc, cur) => {
    const { type } = cur;
    const data = acc[type];
    if (data) {
      data.push(cur);
    } else {
      acc[type] = [cur];
    }
    return acc;
  }, {} as GroupedAreaPanelList);
  return groupedPanelList;
};
