import type {
  ClassDataValue,
  ClassItem,
  ClassItemMemberType,
} from '../../shared/constant';

export const resolveMermaidValue = (data: ClassDataValue) => {
  const { title, classList, config } = data;
  const { direction = 'LR' } = config?.visualizer || {};
  const defList: string[] = [];
  for (const classItem of classList) {
    defList.push(resolveClassMermaidValue(classItem));
  }
  const directionDef = `direction ${direction}`;
  return [
    '---',
    `title: ${title}`,
    '---',
    'classDiagram',
    directionDef,
    defList,
  ]
    .flat()
    .join('\n');
};

const resolveClassMermaidValue = (value: ClassItem) => {
  const {
    note,
    className,
    properties = [],
    methods = [],
    related = [],
  } = value;
  const noteDef = note ? `["${className}  (${note})"]` : '';
  const classDefList = [`class ${className}${noteDef}`];
  for (const item of properties) {
    classDefList.push(resolvePropertyMermaidValue(className, item));
  }
  for (const item of methods) {
    classDefList.push(resolveMethodMermaidValue(className, item));
  }
  for (const item of related) {
    classDefList.push(resolveRelatedMermaidValue(className, item));
  }
  return classDefList.join('\n');
};

const resolvePropertyMermaidValue = (
  className: string,
  value: Required<ClassItem>['properties'][0],
) => {
  const { memberType, name, type } = value;
  const { prefix, suffix } = resolveMermaidMemberType(memberType);
  return `${className} : ${prefix}${type} ${name}${suffix}`;
};
const resolveMethodMermaidValue = (
  className: string,
  value: Required<ClassItem>['methods'][0],
) => {
  const { memberType, name, parameters, returnType } = value;
  const { prefix, suffix } = resolveMermaidMemberType(memberType);
  const parametersValue = parameters
    .map((item) => `${item.type} ${item.name}`)
    .join(', ');
  return `${className} : ${prefix}${name}(${parametersValue}) ${returnType}${suffix}`;
};

const resolveRelatedMermaidValue = (
  className: string,
  value: Required<ClassItem>['related'][0],
) => {
  const { classItem, relationshipType, note } = value;
  let relationshipValue = '';
  if (relationshipType === 'Inheritance') {
    relationshipValue = '<|--';
  } else if (relationshipType === 'Composition') {
    relationshipValue = '*--';
  } else if (relationshipType === 'Aggregation') {
    relationshipValue = 'o--';
  } else if (relationshipType === 'Association') {
    relationshipValue = '-->';
  } else if (relationshipType === 'Dependency') {
    relationshipValue = '..>';
  } else if (relationshipType === 'Realization') {
    relationshipValue = '..|>';
  } else if (relationshipType === 'LinkSolid') {
    relationshipValue = '--';
  } else if (relationshipType === 'LinkDashed') {
    relationshipValue = '..';
  }
  if (!relationshipValue) {
    return '';
  }
  let res = `${className} ${relationshipValue} ${classItem.className}`;
  if (note) {
    res += ` : ${note}`;
  }
  return res;
};

const resolveMermaidMemberType = (value: ClassItemMemberType) => {
  let prefix = '';
  let suffix = '';
  if (value.public) {
    prefix = '+';
  } else if (value.private) {
    prefix = '-';
  } else if (value.protected) {
    prefix = '#';
  }
  if (value.abstract) {
    suffix = '*';
  } else if (value.static) {
    suffix = '$';
  }
  return { prefix, suffix };
};
