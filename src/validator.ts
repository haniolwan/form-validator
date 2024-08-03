type ValidatorFunction = (value: any, data: DynamicObject) => ValidationResult;
type ValidationResult = { valid: boolean; message?: string };

type SchemaDefinition = Array<string | "required">;
type Schema = Record<string, SchemaDefinition>;

type DynamicObject = {
    [key: string]: any;
};

export default class Validator {
    private validators: ValidatorFunction[] = [];
    /* eslint-disable no-useless-escape */
    private rEmail =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    private rUrl =
        /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

    private rImage = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;

    validate(value: string, data: DynamicObject): ValidationResult {
        for (const validator of this.validators) {
            const result = validator(value, data);
            if (!result.valid) {
                return { valid: false, message: result.message };
            }
        }
        return { valid: true };
    }

    required(): Validator {
        this.validators.push((value) => {
            return {
                valid:
                    (value !== null && value !== undefined && value.length > 0) || // check for text and arrays
                    (value instanceof File && value.size > 0) || // check for files
                    value ||
                    (Array.isArray(value) && value.length > 0), // Check for arrays,
                message: "Value is required",
            };
        });
        return this;
    }

    string(): Validator {
        this.validators.push((value) => ({
            valid: typeof value === "string",
            message: "Value must be a string",
        }));
        return this;
    }

    number(): Validator {
        this.validators.push((value) => ({
            valid: typeof value === "number",
            message: "Value must be a number",
        }));
        return this;
    }

    email(): Validator {
        this.validators.push((value: string) => ({
            valid: this.rEmail.test(value),
            message: "Value must be a valid email address",
        }));
        return this;
    }

    url(): Validator {
        this.validators.push((value: string) => ({
            valid: this.rUrl.test(value),
            message: "Value must be a valid url",
        }));
        return this;
    }

    min(value: number): Validator {
        this.validators.push((input: string) => ({
            valid: input.length >= value,
            message: `Value must be at least ${value} characters long`,
        }));
        return this;
    }

    max(value: number): Validator {
        this.validators.push((input: string) => ({
            valid: input.length <= value,
            message: `Value must be at most ${value} characters long`,
        }));
        return this;
    }
    password(): Validator {
        this.validators.push((input: string) => {
            return {
                valid: input?.length > 8,
                message: `Password must be at least ${8} characters long`,
            };
        });
        return this;
    }

    confirm_password(): Validator {
        this.validators.push((input: string, data: DynamicObject) => {
            const password = data["password"];
            return {
                valid: input === password,
                message: "Passwords do not match",
            };
        });
        return this;
    }
    image(): Validator {
        this.validators.push((input: File | string) => {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
            return {
                valid:
                    input instanceof File
                        ? validImageTypes.includes(input["type"])
                        : this.rImage.test(input),
                message: "Image type is invalid",
            };
        });
        return this;
    }
}