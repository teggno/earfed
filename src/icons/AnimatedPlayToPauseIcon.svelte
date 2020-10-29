<script>
  export let durationMillis = 0;
  let logoBegin = 0;
  let logoStatic = durationMillis / 3;
  let logoDuration = (durationMillis - logoBegin - logoStatic) / 3;
  let pauseBegin = logoBegin + logoStatic + logoDuration;
  let pauseDuration = durationMillis - pauseBegin;
</script>

<svg
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  version="1.1">
  <g>
    <!-- <circle cx="12" cy="12" r="12" fill="#ddd" opacity="0">
         <animate dur={`${durationMillis}ms`} fill="freeze" attributeName="opacity" values="0;1;0" />
      </circle> -->
    <path
      id="ear"
      d="M 9.4 12 c 0.058 0 0.112 -0.012 0.152 -0.03 c 0.142 -0.074 0.242 -0.176 0.342 -0.476 c 0.102 -0.312 0.294 -0.458 0.478 -0.6 c 0.158 -0.122 0.322 -0.248 0.464 -0.506 c 0.106 -0.192 0.164 -0.402 0.164 -0.588 c 0 -0.56 -0.44 -1 -1 -1 c -0.56 0 -1 0.44 -1 1 v 0 h -0.4 v 0 c 0 -0.786 0.614 -1.4 1.4 -1.4 c 0.786 0 1.4 0.614 1.4 1.4 c 0 0.252 -0.076 0.53 -0.214 0.78 c -0.182 0.33 -0.396 0.496 -0.57 0.63 c -0.162 0.124 -0.278 0.214 -0.342 0.41 c -0.12 0.364 -0.274 0.568 -0.546 0.71 c -0.102 0.046 -0.214 0.07 -0.328 0.07 c -0.442 0 -0.8 -0.358 -0.8 -0.8 v 0 h 0.4 v 0 c 0 0.22 0.18 0.4 0.4 0.4 z">
      <animate
        id="ear-logo"
        attributeName="d"
        fill="freeze"
        begin={`${logoBegin}ms`}
        dur={`${logoDuration}ms`}
        to="M 12 17 c 0.203 0 0.392 -0.042 0.532 -0.105 c 0.497 -0.259 0.847 -0.616 1.197 -1.666 c 0.357 -1.092 1.029 -1.603 1.673 -2.1 c 0.553 -0.427 1.127 -0.868 1.624 -1.771 c 0.371 -0.672 0.574 -1.407 0.574 -2.058 c 0 -1.96 -1.54 -3.5 -3.5 -3.5 c -1.96 0 -3.5 1.54 -3.5 3.5 v 0 h -1.4 v 0 c 0 -2.751 2.149 -4.9 4.9 -4.9 c 2.751 0 4.9 2.149 4.9 4.9 c 0 0.882 -0.266 1.855 -0.749 2.73 c -0.637 1.155 -1.386 1.736 -1.995 2.205 c -0.567 0.434 -0.973 0.749 -1.197 1.435 c -0.42 1.274 -0.959 1.988 -1.911 2.485 c -0.357 0.161 -0.749 0.245 -1.148 0.245 c -1.547 0 -2.8 -1.253 -2.8 -2.8 v 0 h 1.4 v 0 c 0 0.77 0.63 1.4 1.4 1.4 z" />
      <animate
        id="ear-pause"
        attributeName="d"
        fill="freeze"
        begin={`${pauseBegin}ms`}
        dur={`${pauseDuration}ms`}
        to="M 14 12 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 0 0 0 0 0 0 v 0 h 0 v -5 c 0 -1.1 0.9 -2 2 -2 c 1.1 0 2 0.9 2 2 c 0 0 0 0 0 3.333 c 0 0 0 0 0 3.334 c 0 0 0 0 0 3.333 c 0 1.1 -0.9 2 -2 2 c 0 0 0 0 0 0 c -1.1 0 -2 -0.9 -2 -2 v -5 h 0 v 0 c 0 0 0 0 0 0 z" />
    </path>
    <path
      id="arrow"
      d="M 8 6.82 v 10.36 c 0 0.79 0.87 1.27 1.54 0.84 c 0 0 0 0 0 0 l 8.14 -5.18 c 0.62 -0.39 0.62 -1.29 0 -1.69 l -8.14 -5.17 c -0.67 -0.43 -1.54 0.05 -1.54 0.84 z">
      <animate
        id="arrow-logo"
        attributeName="d"
        fill="freeze"
        begin={`${logoBegin}ms`}
        dur={`${logoDuration}ms`}
        to="M 4.5 9 v 5.18 c 0 0.395 0.435 0.635 0.77 0.42 c 0 0 0 0 0 0 l 4.07 -2.59 c 0.31 -0.195 0.31 -0.645 0 -0.845 l -4.07 -2.585 c -0.335 -0.215 -0.77 0.025 -0.77 0.42 z" />
      <animate
        id="arrow-pause"
        attributeName="d"
        fill="freeze"
        begin={`${pauseBegin}ms`}
        dur={`${pauseDuration}ms`}
        to="M 6 7 v 10 c 0 1.1 0.9 2 2 2 c 1.1 0 2 -0.9 2 -2 l 0 -10 c 0 -1.1 -0.9 -2 -2 -2 l 0 0 c -1.1 0 -2 0.9 -2 2 z" />
    </path>
  </g>
</svg>
