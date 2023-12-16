export interface LcRuntimeTreeNode {
  // 节点-节点API
  node: {
    // 事件
    events: unknown;
    getChildren: () => unknown[];
    addChild: (child: unknown) => void;
    addChildren: (children: unknown[]) => void;
  };
  // 节点-前端视图API
  view: {
    // 事件
    events: unknown;
    getComponent: () => unknown;
    show: () => void;
    hide: () => void;
    destroy: () => void;
  };
  // 节点-前端数据API
  data: {
    // 事件
    events: unknown;
    getDataModel: () => unknown | null;
    getProps: () => unknown;
    getState: () => unknown;
  };
  // 节点-业务逻辑(后端)API
  business: {
    // 事件
    events: unknown;
    // 业务逻辑处理
    // ...
  };
}
