/* eslint-disable @typescript-eslint/no-explicit-any */

const deleteAtPath = (obj: Record<string, unknown>, path: string[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  const next = obj[path[index]];
  if (next && typeof next === 'object') {
    deleteAtPath(next as Record<string, unknown>, path, index + 1);
  }
};

export function toJSON(schema: any) {
  let transform: ((doc: unknown, ret: Record<string, unknown>, options: unknown) => unknown) | undefined;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: unknown, ret: Record<string, unknown>, options: unknown) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      if (ret._id != null) {
        ret.id = String(ret._id);
        delete ret._id;
      }
      delete ret.__v;
      if (transform) {
        return transform(doc, ret, options);
      }
      return ret;
    },
  });
}

export default toJSON;
