import Validator from "./validator";

type SchemaDefinition = Array<string | "required">;
type Schema = Record<string, SchemaDefinition>;

type DynamicObject = {
  [key: string]: any;
};


export function object(schema: Schema) {
  return {
    validate: function (data: DynamicObject) {
      const errors: any = {};

      for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
          const validators = schema[key];
          const value = data[key];

          const validator: any = new Validator();

          for (const validatorDescriptor of validators) {
            const [validatorFnName, ...validatorOptions] =
              validatorDescriptor.split(":");
            const [fName, number] = validatorFnName.split("=");
            switch (fName) {
              case "min":
                validator.min(number);
                break;
              case "max":
                validator.max(number);
                break;
              default:
                if (typeof validator[fName] === "function") {
                  validator[validatorFnName](...validatorOptions, data);
                } else {
                  throw new Error(`Function '${validatorFnName}' is missing in the validator object.`);
                }
                break;
            }
          }
          const result = validator.validate(value, data);
          if (!result.valid) {
            errors[key] = result.message;
          }
        }
      }

      if (Object.keys(errors).length === 0) {
        return { valid: true, data };
      } else {
        return { valid: false, errors };
      }
    },
  };
}
