export class Model {
  static get modelName() {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line
      console.error("modelName not implemented.");
    }
  }

  constructor() {}

  serialize(fields = null) {
    const fieldNames = fields === null ? Object.keys(this) : fields;
    return fieldNames.reduce((acc, cur) => {
      const key = cur.startsWith("_") ? cur.slice(1) : cur;
      let val = this[key];
      if (val === "") val = null;
      return { ...acc, [key]: val };
    }, {});
  }

  toJSON() {
    return this.serialize();
  }
}
