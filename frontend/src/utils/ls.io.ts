export const lsRead = <T>(key: string): undefined | T => {
  let jsonData = localStorage.getItem(key);

  if (!jsonData) return;

  return JSON.parse(jsonData) as T;
};

export const lsWrite = (key: string, data: any): void =>
  localStorage.setItem(key, JSON.stringify(data));
