interface IResultParams<T> {
  items: T[]
  totalCount: number;
}

export interface IPaginationParams {
  currentPage: number;
  pageSize: number;
}

export interface IPaginationResult<T> {
  items: T[];
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function resultPaginated<T>({
  items,
  currentPage,
  pageSize,
  totalCount,
}: IResultParams<T> & IPaginationParams): IPaginationResult<T> {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  return {
    items,
    startIndex,
    endIndex,
    totalPages,
    currentPage,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}