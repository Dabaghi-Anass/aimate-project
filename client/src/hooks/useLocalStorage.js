export default function useLocalStorage() {
  function post(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  function get(name) {
    return JSON.parse(localStorage.getItem(name));
  }
  function checkIfExist(name) {
    let bool = get(name);
    if (!bool || bool === {}) return false;
    return true;
  }
  return { post, get, checkIfExist };
}
