export function parseQuery(query) {
  return (
    query
      ?.replace(/^\?/, "")
      .split("&")
      .reduce((prev, cur) => {
        const [k, v] = cur.split("=");
        prev[k] = v;
        return prev;
      }, {}) || {}
  );
}
