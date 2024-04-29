import { z } from "zod";
import {
  TUltraFormFeild,
  TUltraFormFeildType,
} from "../frontend/components/common/UltraForm";

const UltraTypeToZodValidators = {
  [TUltraFormFeildType.Boolean]: z.boolean,
  [TUltraFormFeildType.Multiline]: z.string,
  [TUltraFormFeildType.Number]: z.number,
  [TUltraFormFeildType.Select]: z.enum,
  [TUltraFormFeildType.String]: z.string,
} as const;

export default function ultraToZod(ultraConfig: TUltraFormFeild[]) {
  const zodConf: z.ZodRawShape = {};

  for (const feild of ultraConfig) {
    const validator = UltraTypeToZodValidators[feild.type];

    // @ts-ignore
    let validated: z.ZodSchema = validator(feild.selectOptions);

    if (!feild.required) {
      validated = validated.optional();
    }

    if (feild.isMultiple) {
      validated = z.array(validated);
    }

    zodConf[feild.type] = validated;
  }

  return z.object(zodConf);
}
