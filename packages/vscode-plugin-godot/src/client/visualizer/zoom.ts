// https://github.com/corentinleberre/docsify-mermaid-zoom/blob/main/src/zoom.js

import * as d3 from 'd3';
import { enableZoomSvg, resetZoomSvg } from './svg';
const mermaidZoom = (
  elementId = '.mermaid',
  minimumScale = 1,
  maximumScale = 1000,
  zoomMenu = true,
) => {
  const nodes = document.querySelectorAll(elementId);
  nodes?.forEach((node) => {
    const d3SvgNode = d3.select(node as SVGSVGElement);
    d3SvgNode.html(`<g>${d3SvgNode.html()}</g>`);
    const inner = d3SvgNode.select<SVGSVGElement>('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>();

    node.addEventListener('click', () => enableZoom());

    const enableZoom = () => {
      zoom
        .on('zoom', (event) => inner.attr('transform', event.transform))
        .scaleExtent([minimumScale, maximumScale]);
      d3SvgNode.call(zoom);
    };

    const disableZoom = () => {
      d3SvgNode.on('.zoom', null);
    };

    const resetZoom = () => {
      inner.transition().call(zoom.scaleTo, 1);
      const { offsetWidth, offsetHeight } = node as HTMLElement;
      if (offsetWidth && offsetHeight) {
        inner
          .transition()
          .call(zoom.translateTo, 0.5 * offsetWidth, 0.5 * offsetHeight);
      }
      disableZoom();
    };

    const isInViewport = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    document.addEventListener(
      'scroll',
      () => {
        if (!isInViewport(node)) {
          disableZoom();
          resetZoom();
        }
      },
      {
        passive: true,
      },
    );

    const createZoomMenu = (node: Element) => {
      const div = document.createElement('div');

      div.style.visibility = 'hidden';

      node.addEventListener('mouseover', () => {
        div.style.visibility = 'visible';
        div.style.display = 'flex';
        div.style.justifyContent = 'flex-start';
      });

      node.addEventListener('mouseleave', () => {
        div.style.visibility = 'hidden';
      });

      const buildButton = (handler: () => unknown, value: string) => {
        const button = document.createElement('button');
        button.innerHTML = value;
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => handler());
        return button;
      };

      const enableZoomBtn = buildButton(enableZoom, enableZoomSvg);
      const resetButton = buildButton(resetZoom, resetZoomSvg);

      div.appendChild(enableZoomBtn);
      div.appendChild(resetButton);
      node.parentElement?.appendChild(div);
    };

    if (zoomMenu) {
      createZoomMenu(node);
    }
  });
};

export { mermaidZoom };
