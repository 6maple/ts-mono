export type LayoutAreaType = ValueOf<typeof LAYOUT_AREA_TYPE>;
export const LAYOUT_AREA_TYPE = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

export type LayoutAreaPanelType = ValueOf<typeof LAYOUT_AREA_PANEL_TYPE>;
export const LAYOUT_AREA_PANEL_TYPE = {
  FULL: 'full',
  TOP: 'top',
  Bottom: 'bottom',
} as const;

export interface LayoutArea {
  name: string;
  type: LayoutAreaType;
  panelList: LayoutAreaPanel[];
}

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
  const areaList: LayoutArea[] = [];
  const getAreaList = () => {
    return areaList;
  };
  const addArea = (value: LayoutArea) => {
    return areaList.push(value);
  };
  const getSortedAreaList = (type: LayoutAreaType) => {
    return resolveSortedAreaList(areaList, type);
  };
  return {
    areaList,
    getAreaList,
    getSortedAreaList,
    addArea,
    resolveGroupedAreaPanelList,
  };
};

const resolveSortedAreaList = (
  areaList: LayoutArea[],
  type: LayoutAreaType,
) => {
  return areaList.filter((item) => item.type === type);
};

export const resolveGroupedAreaPanelList = (area: LayoutArea) => {
  const { panelList } = area;
  const groupedPanelList = panelList.reduce(
    (acc, cur) => {
      const { type } = cur;
      const data = acc[type];
      if (data) {
        data.push(cur);
      } else {
        acc[type] = [cur];
      }
      return acc;
    },
    {} as Record<LayoutAreaPanelType, LayoutAreaPanel[]>,
  );
  return groupedPanelList;
};
