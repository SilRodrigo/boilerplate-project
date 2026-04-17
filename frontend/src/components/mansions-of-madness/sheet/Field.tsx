import { CATALOG, type GameId } from "@/data/catalog";
import type { FieldType } from "@/data/characters";
import { cn } from "@/lib/utils";
import { getConfig } from "@/utils/getConfig";

type FieldProps = {
  field: FieldType;
  baseFieldValue?: number;
  containerClassName?: string;
  collectionItemClassName?: string;
  labelClassName?: string;
  fieldClassName?: string;
  bodyContainerClassName?: string;
  icon?: string;
};

export default function Field({
  field,
  baseFieldValue,
  icon,
  containerClassName = '',
  labelClassName = '',
  collectionItemClassName = '',
  bodyContainerClassName = '',
  fieldClassName = '',
}: FieldProps) {
  const config = getConfig(CATALOG.MANSIONS_OF_MADNESS as GameId);

  const label = (
    <div className={cn('text-sm pb-1', labelClassName)}>
      {field.label}
    </div>);

  let body = null;

  if (field.type === "collection") {
    body = (
      <div className={cn("pt-3 flex gap-3", bodyContainerClassName)}>
        {field.value.map((item: any, index: number) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <img
              src={item.image}
              alt={item.name}
              className={cn("max-w-16 hover:max-w-44 transition-all duration-300 object-contain", collectionItemClassName)}
            />
          </div>
        ))}
      </div>
    );
  }

  if (field.type === "number") {
    body = (
      <div className={cn("flex justify-between gap-1", bodyContainerClassName)}>
        {icon && <img src={icon} alt={field.label} />}
        {field.value}{baseFieldValue && `/${baseFieldValue}`}
      </div>
    );
  }

  if (field.type === "string") {
    body = (
      <span className={fieldClassName}>
        {field.value}
      </span>
    );
  }

  return (<>
    <div className={cn('border rounded-md p-2 hover:opacity-75 transition-all duration-300 cursor-default', containerClassName)}
      style={{ borderColor: (config.colors as Record<string, string>)[field.key], backgroundColor: (config.colors as Record<string, string>)[field.key] + '25' }}>
      {label}{body}
    </div>
  </>);
}
