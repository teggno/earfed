/* proces.env.NODE_ENV is used in sw.ts and replaced by rollup. The following
declaration stops typescript from complaining about this */
declare var process: {
  env: {
    NODE_ENV: string;
  };
};

/* stop typescript from complaining about some non-existing properties in `self`
in sw.js */
interface Window {
  __WB_DISABLE_DEV_LOGS: boolean;
  __WB_MANIFEST: any;
}
