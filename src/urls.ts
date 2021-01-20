export function parseQuery(query: string) {
  return (
    query
      ?.replace(/^\?/, "")
      .split("&")
      .reduce((prev, cur) => {
        const [k, v] = cur.split("=");
        prev[k] = v;
        return prev;
      }, {} as { [key: string]: string }) || {}
  );
}
