import * as fs from 'fs-extra';
import * as schema from './api-schema';

// TODO: Rename "constructor" property in schema since this name is already used by plain JavaScript objects
export type ExtendedApi = schema.Api & Partial<{isNativeObject: boolean, parent: ExtendedApi}>;
export type ApiDefinitions = {[name: string]: ExtendedApi};
export type Methods = schema.Method | schema.Method[];

export function capitalizeFirstChar(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFirstChar(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export class TextBuilder {

  public lines: string[];
  public indent: number;

  constructor(initial?: string[]) {
    this.lines = initial || [];
    this.indent = 0;
  }

  public append(...args: string[]) {
    Array.prototype.forEach.call(arguments, arg => {
      const lines = typeof arg === 'string' ? arg.split('\n') : arg;
      for (const line of lines) {
        this.lines.push(this._indentLine(line));
      }
    }, this);
  }

  public toString() {
    return this.lines.join('\n');
  }

  private _indentLine(line) {
    return line.length > 0 ? '  '.repeat(this.indent) + line : line;
  }

}

export function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function filter<T>(obj: T, filterFunction): T {
  return Object.keys(obj)
    .filter(key => filterFunction(obj[key]))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {}) as T;
}

export function readJsonDefs(files) {
  const defs = {};
  files.forEach(file => {
    const json = fs.readJsonSync(file);
    json.file = file;
    defs[json.type || json.object || json.title] = json;
  });
  return defs as ApiDefinitions;
}

export function extendTypeDefs(defs: ApiDefinitions) {
  Object.keys(defs).forEach(name => {
    defs[name].isNativeObject = isNativeObject(defs, defs[name]);
    if (defs[name].extends) {
      defs[name].parent = defs[defs[name].extends];
    }
  });
}

export function createDoc(documentable: ExtendedApi | schema.Property | schema.Method | schema.Event | schema.Event) {
  const def = documentable as Partial<ExtendedApi & schema.Property & schema.Method & schema.Event & schema.Event>;
  if (!def.description && !def.static && !def.provisional) {
    return;
  }
  const result: string[] = [];
  if (def.description) {
    splitIntoLines(def.description, 100).forEach(line => {
      result.push(line);
    });
  }
  if (def.parameters) {
    createParamAnnotations(def.parameters).forEach(line => {
      result.push(line);
    });
  }
  if (def.static) {
    result.push('@static');
  }
  if (def.provisional) {
    result.push('@provisional');
  }
  return createComment(result);
}

function createComment(comment: string[]) {
  return ['/**'].concat(comment.map(line => ' * ' + line), ' */').join('\n');
}

function createParamAnnotations(params: schema.Parameter[]) {
  return params.map(param => {
    const name = param.name.startsWith('...') ? param.name.slice(3) : param.name;
    const description = param.description || '';
    return `@param ${name} ${description}`;
  });
}

function splitIntoLines(text: string, maxLength: number) {
  const linesIn = text.split('\n');
  const linesOut = [];
  for (const lineIn of linesIn) {
    let lineOut = '';
    const words = lineIn.split(' ');
    for (const word of words) {
      if (lineOut.length + word.length > maxLength) {
        linesOut.push(lineOut);
        lineOut = '';
      }
      if (lineOut.length > 0) {
        lineOut += ' ';
      }
      lineOut += word;
    }
    if (lineOut.length > 0) {
      linesOut.push(lineOut);
    }
  }
  return linesOut;
}

export function createEventTypeName(widgetName: string, eventName: string, event: schema.Event) {
  if (event.parameters) {
    return event.eventObject || (widgetName + capitalizeFirstChar(eventName) + 'Event');
  } else {
    return `EventObject<tabris.${widgetName}>`;
  }
}

function isNativeObject(defs, def) {
  return def && (def.type === 'NativeObject' || isNativeObject(defs, defs[def.extends]));
}
