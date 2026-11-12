async function getItem(key: string = '', namespace: string = 'bulls-cows') {
  const value = localStorage.getItem(`${namespace}:${key}`);
  return value ? JSON.parse(value) : null;
}

function setItem<T>(key: string = '', value: T | undefined = undefined, namespace: string = 'bulls-cows') {
  localStorage.setItem(`${namespace}:${key}`, JSON.stringify(value));
}

function removeItem(key: string = '', namespace: string = 'bulls-cows') {
  localStorage.removeItem(`${namespace}:${key}`);
}

export default {setItem, getItem, removeItem};
