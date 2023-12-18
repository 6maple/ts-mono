import fs from 'node:fs/promises';
import fg from 'fast-glob';
import type { ClassItem, VscodePluginConfig } from '../../shared/constant';

export const resolveClassListByDir = async (
  dir: string,
  config: Required<VscodePluginConfig>['visualizer'],
) => {
  const { includePatterns, excludePatterns = [], ignoreMember = true } = config;
  const entries = await fg.async(includePatterns!, {
    dot: true,
    cwd: dir,
    onlyFiles: true,
    absolute: true,
    ignore: excludePatterns,
  });
  const gdList = entries.filter((item) => item.endsWith('.gd'));
  const gdFileList = await Promise.all(
    gdList.map((item) => {
      return fs.readFile(item, { encoding: 'utf8' });
    }),
  );
  const classNameList = gdFileList
    .map((item) => {
      const matchedRes = item.match(
        new RegExp(`(^|\\n)class_name (?<name>${WORD_REGEX})`),
      );
      if (matchedRes?.groups) {
        return { file: item, className: matchedRes.groups.name.trim() };
      }
      return null;
    })
    .filter(Boolean) as {
    file: string;
    className: string;
  }[];
  const classNameTypeRegex = new RegExp(
    `(:|( as )|->)[ ]*(?<type>(${classNameList
      .map(({ className }) => className)
      .join('|')}))(\\W|$)`,
    'g',
  );
  const res: (ClassItem | null)[] = classNameList.map((item) =>
    resolveGDClass(item.file, item.className, classNameTypeRegex, ignoreMember),
  );
  return res.filter(Boolean) as ClassItem[];
};

const DEFAULT_TYPE = 'Variant';

const WORD_REGEX = '([a-zA-Z_][a-zA-Z_0-9]*)';
const TYPE_REGEX = `(${WORD_REGEX}|[\\[\\]])`;
// const BLOCK_START_ITEM_REGEX = '(  )';
// const BLOCK_START_REGEX = `^${BLOCK_START_ITEM_REGEX}*`;

const CLASS_NAME_REGEX = `^class_name (?<name>${WORD_REGEX})[ ]*$`;
const EXTENDS_REGEX = `^extends (?<name>${WORD_REGEX})[ ]*$`;
// const CLASS_DEF_REGEX = `^class[ ]+(?<name>${WORD_REGEX})[ ]*:`;
const CONST_DEF_REGEX = `^const[ ]+(?<name>${WORD_REGEX})[ ]*(:[ ]*(?<type>${TYPE_REGEX}*?))?`;
const VAR_DEF_REGEX = `^(@export${WORD_REGEX}*[ ])?var[ ]+(?<name>${WORD_REGEX})[ ]*(:[ ]*(?<type>${TYPE_REGEX}*?))?`;

const FUNC_PARAM_ITEM_REGEX = `[\n ]*(${WORD_REGEX})(:[ ]*(${TYPE_REGEX}+?))?[\n ]*`;
const FUNC_PARAM_REGEX = `^(?<name>${WORD_REGEX})(:[ ]*(?<type>${TYPE_REGEX}+?))?$`;
const FUNC_RETURN_TYPE_REGEX = `([ ]*->[ ]*(?<returnType>${TYPE_REGEX}+?))`;
const FUNC_DEF_REGEX = `^func[ ]+(?<name>${WORD_REGEX})[ ]*\\((?<params>${FUNC_PARAM_ITEM_REGEX}(,${FUNC_PARAM_ITEM_REGEX})*(,[ ]*)?)?\\)${FUNC_RETURN_TYPE_REGEX}?:`;

export const resolveGDClass = (
  content: string,
  className: string,
  classNameTypeRegex: RegExp,
  ignoreMember = true,
): ClassItem | null => {
  const selfTypeRegex = new RegExp(`${className}[.]?`);
  const lineList = content.split('\n');
  const properties: ClassItem['properties'] = [];
  const methods: ClassItem['methods'] = [];
  const related: ClassItem['related'] = [];
  const depClassNameList = [...content.matchAll(classNameTypeRegex)]
    .map((item) => item.groups?.type)
    .filter(Boolean) as string[];
  const depClassNameToRecordedMap = new Map(
    depClassNameList.map((item) => [item, false]),
  );
  while (lineList.length > 0) {
    const line = lineList.shift()!;
    if (line.trim() === '') {
      continue;
    }
    let matchedRes = line.match(new RegExp(CLASS_NAME_REGEX));
    if (matchedRes?.groups) {
      const { name } = matchedRes.groups;
      className = name;
      continue;
    }
    matchedRes = line.match(new RegExp(EXTENDS_REGEX));
    if (matchedRes?.groups) {
      const { name } = matchedRes.groups;
      related.push({
        relationshipType: 'Realization',
        classItem: {
          className: name,
        },
      });
      continue;
    }
    if (ignoreMember) {
      continue;
    }
    matchedRes = line.match(new RegExp(CONST_DEF_REGEX));
    if (matchedRes?.groups) {
      const { name, type } = matchedRes.groups;
      if (!selfTypeRegex.test(type) && depClassNameToRecordedMap.has(type)) {
        depClassNameToRecordedMap.set(type, true);
        related.push({
          relationshipType: 'Association',
          classItem: {
            className: type,
          },
        });
      }
      properties.push({
        name,
        const: true,
        type: type || DEFAULT_TYPE,
        memberType: {
          protected: name.startsWith('_'),
          public: !name.startsWith('_'),
        },
      });
      continue;
    }
    matchedRes = line.match(new RegExp(VAR_DEF_REGEX));
    if (matchedRes?.groups) {
      const { name, type } = matchedRes.groups;
      if (!selfTypeRegex.test(type) && depClassNameToRecordedMap.has(type)) {
        depClassNameToRecordedMap.set(type, true);
        related.push({
          relationshipType: 'Association',
          classItem: {
            className: type,
          },
        });
      }
      properties.push({
        name,
        type: type || DEFAULT_TYPE,
        memberType: {
          protected: name.startsWith('_'),
          public: !name.startsWith('_'),
        },
      });
      continue;
    }
    matchedRes = line.match(new RegExp(FUNC_DEF_REGEX));
    if (matchedRes?.groups) {
      const { name, params, returnType } = matchedRes.groups;
      methods.push({
        name,
        parameters: (params || '')
          .split(',')
          .map((item) => {
            const matched = item.trim().match(FUNC_PARAM_REGEX);
            if (matched?.groups) {
              const { name, type } = matched.groups;
              return { name, type: type || DEFAULT_TYPE };
            }
            return null;
          })
          .filter(Boolean) as { name: string; type: string }[],
        returnType: returnType || DEFAULT_TYPE,
        memberType: {
          protected: name.startsWith('_'),
          public: !name.startsWith('_'),
        },
      });
      continue;
    }
  }
  if (className) {
    for (const [name, recorded] of depClassNameToRecordedMap.entries()) {
      if (!recorded && !selfTypeRegex.test(name)) {
        related.push({
          relationshipType: 'Dependency',
          classItem: { className: name },
        });
      }
    }
    return {
      className,
      properties,
      methods,
      related,
    };
  }
  return null;
};
