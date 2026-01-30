import type { FieldType } from "@/data/characters";
import { getConfig } from "@/utils/getConfig";

type FieldProps = {
  field: FieldType;
  containerClassName?: string;
  labelClassName?: string;
};

export default function Field({
  field,
  containerClassName = '',
  labelClassName = "text-sm",
}: FieldProps) {
  const config = getConfig('eldritch');

  const label = (
    <div className={labelClassName}>
      {field.label}
    </div>);

  let body = null;

  if (field.type === "collection") {
    body = (
      <div className="pt-3 flex gap-3">
        {field.value.map((item: any, index: number) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <img
              src={item.image}
              alt={item.name}
              className="max-w-16 hover:max-w-44 transition-all duration-300 object-contain"
            />
          </div>
        ))}
      </div>
    );
  }

  if (field.type === "number") {
    body = (
      <div>
        {field.value}
      </div>
    );
  }

  if (field.type === "string") {
    body = (
      <span className="italic text-sm">
        {field.value}
      </span>
    );
  }

  return (<>
    <div className={containerClassName + ' border rounded-md p-2 hover:opacity-75 transition-all duration-300 cursor-default'}
      style={{ borderColor: (config.colors as Record<string, string>)[field.key], backgroundColor: (config.colors as Record<string, string>)[field.key] + '25' }}>
      {label}{body}
    </div>
  </>);
}
