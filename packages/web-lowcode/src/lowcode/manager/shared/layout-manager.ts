export type LayoutAreaType = ValueOf<typeof LAYOUT_AREA_TYPE>;
export const LAYOUT_AREA_TYPE = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

export type LayoutAreaPanelType = ValueOf<typeof LAYOUT_AREA_PANEL_TYPE>;
export const LAYOUT_AREA_PANEL_TYPE = {
  TOP: 'top',
  Bottom: 'bottom',
} as const;

export interface LayoutArea {
  name: string;
  /**
   * top 高度
   * @example 'auto' | '100px' | '10%'
   */
  topHeight?: string;
  /**
   * bottom 高度
   * @example 'auto' | '100px' | '10%'
   */
  bottomHeight?: string;
  /**
   * 宽度
   * @example 'auto' | '100px' | '10%'
   */
  width?: string;
  type: LayoutAreaType;
  panelList: LayoutAreaPanel[];
}

export type TypeToLayoutArea = Partial<Record<LayoutAreaType, LayoutArea[]>>;

export type LayoutAreaPanelRenderType = 'mount' | 'update';

export interface LayoutAreaPanel {
  name: string;
  title: string | (() => string);
  type: LayoutAreaPanelType;
  renderElement: (
    previousValue: HTMLElement | undefined | null,
    parent: HTMLElement,
    type: LayoutAreaPanelRenderType,
  ) => HTMLElement | null | undefined;
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
