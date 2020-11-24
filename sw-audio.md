# Analyzing the issue with requesting audio where the server responds with a 302 redirect.

## new Audio() without crossOrigin
return fetch(request) in service worker, FF: works but occasionally error message in console: Conclusion: error has some play/pause cause. When pausing and waiting a bit before playing another episode, there's no error.
return fetch(request) in service worker, Chrome: works, no error message in console

new NetworkOnly() in service worker, FF: works but occasionally error message in console: Conclusion: error has some play/pause cause. When pausing and waiting a bit before playing another episode, there's no error.
new NetworkOnly() in service worker, Chrome: works, no error message in console

## new Audio() with crossOrigin="anonymous"
return fetch(request) in service worker, Chrome:
"Access to fetch at 'https://traffic.libsyn.com/secure/syntax/Syntax298.mp3?dest-id=532671' from origin 'https://teggno.dev:5000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request."

new NetworkOnly() in service worker, Chrome: error message:
"Access to fetch at 'https://traffic.libsyn.com/secure/syntax/Syntax298.mp3?dest-id=532671' from origin 'https://teggno.dev:5000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request."

## using service worker directly (i.e. without workbox)

Same as with workbox

## `<audio>` on page

Same as with new Audio()

# Requests

## First Request
Url: https://traffic.libsyn.com/secure/syntax/Syntax299.mp3?dest-id=532671
Response: 302, location https://hwcdn.libsyn.com/p/e/a/4/ea4ed600c7337f3b/Syntax299.mp3?c_id=87790187&cs_id=87790187&destination_id=532671&expiration=1606208971&hwt=998770e949056aa3d7f10d8f20085099
access-control-allow-origin: \*

## Second Request (triggered by redirect)

Url: https://hwcdn.libsyn.com/p/e/a/4/ea4ed600c7337f3b/Syntax299.mp3?c_id=87790187&cs_id=87790187&destination_id=532671&expiration=1606208971&hwt=998770e949056aa3d7f10d8f20085099
Response: 200
access-control-allow-origin: \*

# Solution

It seems to be working by adding `"access-control-request-headers": "range"` as a header to the request before passing it to `fetch()` in the service worker.
