import type { FieldType } from "@/data/characters";

export function Skill({ field }: { field: FieldType }) {
  return (
    <div className="skill">
      <h3>{field.label}</h3>
      {field.type !== 'collection' && <strong>{field.value}</strong>}
      {field.type === 'collection' && (
        <ul>
          {field.value.map((item: any) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
