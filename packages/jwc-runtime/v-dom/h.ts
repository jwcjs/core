import { VNode } from './diff';

export function h(
  tag: string,
  props: any,
  ...children: any[]
): VNode {
  return new VNode(tag, props, children);
}