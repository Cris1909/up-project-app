export const validateEnum = (enumType: any, value: any) => {
 return Object.values(enumType).includes(value)
}