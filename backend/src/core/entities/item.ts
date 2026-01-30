export interface IItem {
  id: string;
  name: string;
  image: string;
  modifiers: { [key: string]: number };
  trait: string;
  description: string;
  quantity?: number;
}