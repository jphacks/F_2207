export const setItem = (key: string, _value: Object | number | string) => {
  let value: string
  if (typeof _value === "object") {
    value = JSON.stringify(_value)
  } else {
    value = `${_value}`
  }
  localStorage.setItem(key, value)
}

export const getItem = (key: string) => {
  const value = localStorage.getItem(key)
  try {
    return JSON.parse(value as string)
  } catch {
    return value
  }
}
