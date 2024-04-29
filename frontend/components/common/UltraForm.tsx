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
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, RefObject, useRef, useState } from "react";
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

export type TUltraFormFeild = {
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

export type TSuggestion = {
  key: string;
  label?: string;
  description?: string;
};

export type TTextSuggestions = { groupName: string; data: TSuggestion[] }[];

type TUtraFormProps = {
  title?: string;
  data: TUltraFormFeild[];
  suggestions?: TTextSuggestions;
  onSubmit?: (data: {}) => Promise<void>;
};

const DefaultDeafaults: Record<TUltraFormFeildType, string | number | boolean> =
  {
    boolean: false,
    multiline: "",
    number: 0,
    select: "",
    string: "",
  };

export default function UltraForm({
  data,
  title,
  suggestions,
}: TUtraFormProps) {
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

          <MultiplyUltraFormFeild
            state={state}
            setState={setState}
            suggestions={suggestions}
            {...feild}
          />

          {feild.helperText && (
            <FormHelperText>{feild.helperText}</FormHelperText>
          )}
        </FormControl>
      ))}
    </Box>
  );
}

function MultiplyUltraFormFeild({
  isMultiple,
  setState,
  state,
  ...props
}: TUltraFormFeild & {
  state: Record<string, TPotentialData | undefined>;
  setState: React.Dispatch<
    React.SetStateAction<Record<string, TPotentialData | undefined>>
  >;
  suggestions?: TTextSuggestions;
}) {
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
  suggestions,
  readonly,
}: TUltraFormFeild & {
  value: any;
  setValue: (p: any) => void;
  suggestions?: TTextSuggestions;
}) {
  const iden = "__ultra__" + label;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const onSuggestionSelect = (suggestion: TSuggestion, groupName: string) => {
    btnRef.current?.focus();
    setValue(`${value}{{${groupName}__${suggestion.key}}}`);
    onClose();
  };

  switch (type) {
    case TUltraFormFeildType.String: {
      return (
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <Input
            id={iden}
            ref={btnRef as RefObject<HTMLInputElement>}
            type="text"
            onChange={(e) => {
              setValue(e.target.value);
              onOpen();
            }}
            onFocus={onOpen}
            value={value}
            placeholder={placeholder}
          />
          <MenuButton as="div" w="100%" />
          {!readonly && (
            <SuggestionMenu
              onSuggestionSelect={onSuggestionSelect}
              suggestions={suggestions}
            />
          )}
        </Menu>
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
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <Textarea
            placeholder={placeholder}
            id={iden}
            ref={btnRef as RefObject<HTMLTextAreaElement>}
            onChange={(e) => {
              setValue(e.target.value);
              onOpen();
            }}
            onFocus={onOpen}
            value={value}
          />
          <MenuButton as="div" w="100%" />
          {!readonly && (
            <SuggestionMenu
              onSuggestionSelect={onSuggestionSelect}
              suggestions={suggestions}
            />
          )}
        </Menu>
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

function SuggestionMenu({
  onSuggestionSelect,
  suggestions,
}: {
  suggestions?: TTextSuggestions;
  onSuggestionSelect: (p: TSuggestion, g: string) => void;
}) {
  if (!suggestions || !onSuggestionSelect) return null;

  return (
    <MenuList h="250px" overflow="auto">
      {suggestions.map((suggestionGroup) => (
        <MenuGroup
          key={suggestionGroup.groupName}
          title={suggestionGroup.groupName.toUpperCase()}
        >
          {suggestionGroup.data.map((sugg) => (
            <Fragment key={sugg.key}>
              <MenuDivider my={0} />
              <MenuItem
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                onClick={() =>
                  onSuggestionSelect(sugg, suggestionGroup.groupName)
                }
              >
                <Text fontWeight={600} fontSize="xl" textTransform="capitalize">
                  {sugg.label || sugg.key.replace("__", " ")}
                </Text>
                {sugg.description && (
                  <Text fontSize="sm" color="GrayText">
                    {sugg.description}
                  </Text>
                )}
              </MenuItem>
            </Fragment>
          ))}
        </MenuGroup>
      ))}
    </MenuList>
  );
}
