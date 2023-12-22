<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import mermaid from 'mermaid';
import { EVENT_TYPE } from '../../shared/constant';
import { vscodeAPI } from '../client-utils';
import { resolveMermaidValue } from './resolver';
import { mermaidZoom } from './zoom';
import type {
  EventDataClassData,
  EventDataRefresh,
} from '../../shared/constant';

const mermaidRenderId = 'diagram';

const content = ref(``);
const refreshLoadingSet = ref(new Set<string>());
const refreshLoading = computed(() => refreshLoadingSet.value.size > 0);
const visualizerMermaidRef = ref();

const generateRefreshKey = () => Date.now().toString();

const refresh = (timeout = 3000) => {
  const refreshKey = generateRefreshKey();
  vscodeAPI?.postMessage({
    type: EVENT_TYPE.refresh,
    refreshKey,
  } as EventDataRefresh);
  refreshLoadingSet.value.add(refreshKey);
  setTimeout(() => {
    refreshLoadingSet.value.delete(refreshKey);
  }, timeout);
};

const updateContent = () => {
  renderMermaid(content.value);
};

const handleMessage = (event: MessageEvent) => {
  const data = event.data as EventDataClassData;
  if (!data || data.type !== EVENT_TYPE.classData) {
    return;
  }
  const loadingSet = refreshLoadingSet.value;
  const { refreshKey } = data;
  loadingSet.delete(refreshKey);
  content.value = resolveMermaidValue(data.value);
  updateContent();
};

const renderMermaid = async (value: string) => {
  const el = visualizerMermaidRef.value;
  if (!el || !value) {
    return;
  }
  try {
    const { svg, bindFunctions } = await mermaid.render(
      mermaidRenderId,
      value,
      el,
    );
    el.innerHTML = svg.replace(/[ ]*max-width:[ 0-9.]*px;/i, '');
    bindFunctions?.(el);
  } catch (error) {
    el.innerHTML = error;
  }
  const svgSelector = `#${mermaidRenderId}`;
  const svg: HTMLElement = (el as HTMLElement).querySelector(svgSelector)!;
  svg.style.height = '100%';
  mermaidZoom(svgSelector);
};
onMounted(() => {
  const isDark = document.body.classList.contains('vscode-dark');
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'forest',
    themeCSS: isDark ? '.loopText tspan { fill: inherit; }' : '',
  });
  window.addEventListener('message', handleMessage);
  refresh();
});
onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage);
});
</script>
<template>
  <div class="visualizer">
    <div class="visualizer-operation-bar">
      <button class="ui-button" :disabled="refreshLoading" @click="refresh()">
        {{ refreshLoading ? 'wait loading..' : 'refresh' }}
      </button>
    </div>
    <div class="visualizer-content">
      <div
        v-show="content"
        ref="visualizerMermaidRef"
        class="visualizer-mermaid"
      />
      <div v-show="!content">
        <span>no data</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.visualizer {
  height: 100vh;
}
.visualizer-operation-bar {
  height: 32px;
  display: flex;
  justify-content: flex-end;
}
.visualizer-content {
  height: calc(100% - 32px);
}
.visualizer-mermaid {
  height: 100%;
}
.ui-button {
  padding: 4px 8px;
  cursor: pointer;
  border-color: #409eff;
  background-color: #409eff;
  color: white;
  border-style: solid;
  border-radius: 5px;
  outline: none;
  box-shadow: none;
  &:hover {
    border-color: #2793ff;
    background-color: #2793ff;
  }
  &:focus {
    border-color: #5eafff;
    background-color: #5eafff;
  }
  &:active {
    border-color: #178afc;
    background-color: #178afc;
  }
}
</style>
