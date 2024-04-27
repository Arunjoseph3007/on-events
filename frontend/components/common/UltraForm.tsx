import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

export enum TUltraFormFeildType {
  String = "string",
  Multiline = "multiline",
  Number = "number",
  Boolean = "boolean",
  Select = "select",
}

type TPotentialData =
  | string
  | number
  | boolean
  | [string, string][]
  | [number, string][]
  | [boolean, string][];

type TUltraFormFeild = {
  label: string;
  required?: boolean;
  readonly?: boolean;
  helperText?: string;
  type: TUltraFormFeildType;
  isMultiple?: boolean;
  selectOptions?: string[];
  initialValue?: TPotentialData;
  placeholder?: string;
};

type TUtraFormProps = {
  title?: string;
  data: TUltraFormFeild[];
  onSubmit?: (data: {}) => Promise<void>;
};

type TUltraContext = {
  state: Record<string, TPotentialData | undefined>;
  setState: React.Dispatch<
    React.SetStateAction<Record<string, TPotentialData | undefined>>
  >;
};

const DefaultDeafaults: Record<TUltraFormFeildType, string | number | boolean> =
  {
    boolean: false,
    multiline: "",
    number: 0,
    select: "",
    string: "",
  };

// TODO: remove this context just pass props
const UltraContext = createContext<TUltraContext>({} as any);

export default function UltraForm({ data, title }: TUtraFormProps) {
  const [state, setState] = useState(
    data.reduce<Record<string, TPotentialData | undefined>>((acc, element) => {
      if (element.initialValue) {
        acc[element.label] = element.initialValue;
      } else {
        const defVal = DefaultDeafaults[element.type];

        // @ts-ignore
        acc[element.label] = element.isMultiple ? [[defVal, uuid()]] : defVal;
      }
      return acc;
    }, {})
  );

  return (
    <UltraContext.Provider value={{ setState, state }}>
      <Box>
        {title && <Heading fontSize="lg">{title}</Heading>}

        {data.map((feild) => (
          <FormControl
            mt={1}
            mb={3}
            isRequired={feild.required}
            isReadOnly={feild.readonly}
            key={feild.label}
          >
            <FormLabel htmlFor={"__ultra__" + feild.label}>
              {feild.label}
            </FormLabel>

            <MultiplyUltraFormFeild {...feild} />

            {feild.helperText && (
              <FormHelperText>{feild.helperText}</FormHelperText>
            )}
          </FormControl>
        ))}
      </Box>
    </UltraContext.Provider>
  );
}

function MultiplyUltraFormFeild({ isMultiple, ...props }: TUltraFormFeild) {
  const { state, setState } = useContext(UltraContext);

  if (!isMultiple) {
    return (
      <UltraFormFeild
        value={state[props.label]}
        setValue={(val) => setState((p) => ({ ...p, [props.label]: val }))}
        isMultiple={false}
        {...props}
      />
    );
  }

  return (
    <Flex gap={2} direction="column">
      {(state[props.label] as Array<[string | number | boolean, string]>).map(
        (value, idx) => (
          <HStack key={value[1]}>
            <UltraFormFeild
              value={value[0]}
              setValue={(val) =>
                setState((p) => {
                  const arr = p[props.label] as any[];
                  arr[idx][0] = val;
                  return { ...p, [props.label]: arr };
                })
              }
              isMultiple={true}
              {...props}
            />
            <Button
              onClick={() => {
                setState((p) => {
                  const arr = p[props.label] as any[];

                  return {
                    ...p,
                    [props.label]: arr.filter((el) => el[1] != value[1]),
                  };
                });
              }}
              colorScheme="gray"
            >
              <DeleteIcon />
            </Button>
          </HStack>
        )
      )}

      <Button
        onClick={() => {
          setState((p) => {
            const arr = p[props.label] as any[];
            arr.push([DefaultDeafaults[props.type], uuid()]);

            return { ...p, [props.label]: arr };
          });
        }}
        leftIcon={<AddIcon />}
      >
        Add
      </Button>
    </Flex>
  );
}

function UltraFormFeild({
  type,
  placeholder,
  label,
  selectOptions,
  setValue,
  value,
}: TUltraFormFeild & { value: any; setValue: (p: any) => void }) {
  const iden = "__ultra__" + label;

  switch (type) {
    case TUltraFormFeildType.String: {
      return (
        <Input
          onChange={(e) => setValue(e.target.value)}
          id={iden}
          placeholder={placeholder}
          type="text"
        />
      );
    }

    case TUltraFormFeildType.Number: {
      return (
        <NumberInput onChange={setValue} flex={1} id={iden}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      );
    }

    case TUltraFormFeildType.Multiline: {
      return (
        <Textarea
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          id={iden}
        />
      );
    }

    case TUltraFormFeildType.Boolean: {
      return <Switch id={iden} onChange={(e) => setValue(e.target.value)} />;
    }

    case TUltraFormFeildType.Select: {
      return (
        <Select
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          id={iden}
        >
          {selectOptions?.map((opt) => (
            <option value={opt} key={opt}>
              {opt}
            </option>
          ))}
        </Select>
      );
    }

    default:
      return null;
  }
}
