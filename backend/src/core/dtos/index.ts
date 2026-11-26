export type WithOptionalIncludes<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export { ICreateExampleDto, IRequestExampleDto, IUpdateExampleDto, IFilterExampleDto, IIncludeExampleDto, IOrderExampleDto, ExampleFilterField } from './example';
export { ICreateUserDto, IRequestUserDto, IUpdateUserDto, IIncludeUserDto, IFilterUserDto, IOrderUserDto, UserFilterField } from './user';
