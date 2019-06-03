/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/app.2ee963b9.css",
    "revision": "4350df4a987d6efb1779365e7443fa8e"
  },
  {
    "url": "css/getThings.0e433876.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "css/makeMoney.0e433876.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "css/newJob.6ffa4e34.css",
    "revision": "e49cb27d6de05dd41043845cae7156b6"
  },
  {
    "url": "css/you.0e433876.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "favicon.ico",
    "revision": "1ba2ae710d927f13d483fd5d1e548c9b"
  },
  {
    "url": "img/icons/android-chrome-192x192.png",
    "revision": "f130a0b70e386170cf6f011c0ca8c4f4"
  },
  {
    "url": "img/icons/android-chrome-512x512.png",
    "revision": "0ff1bc4d14e5c9abcacba7c600d97814"
  },
  {
    "url": "img/icons/apple-touch-icon-120x120.png",
    "revision": "936d6e411cabd71f0e627011c3f18fe2"
  },
  {
    "url": "img/icons/apple-touch-icon-152x152.png",
    "revision": "1a034e64d80905128113e5272a5ab95e"
  },
  {
    "url": "img/icons/apple-touch-icon-180x180.png",
    "revision": "c43cd371a49ee4ca17ab3a60e72bdd51"
  },
  {
    "url": "img/icons/apple-touch-icon-60x60.png",
    "revision": "9a2b5c0f19de617685b7b5b42464e7db"
  },
  {
    "url": "img/icons/apple-touch-icon-76x76.png",
    "revision": "af28d69d59284dd202aa55e57227b11b"
  },
  {
    "url": "img/icons/apple-touch-icon.png",
    "revision": "66830ea6be8e7e94fb55df9f7b778f2e"
  },
  {
    "url": "img/icons/favicon-16x16.png",
    "revision": "4bb1a55479d61843b89a2fdafa7849b3"
  },
  {
    "url": "img/icons/favicon-32x32.png",
    "revision": "98b614336d9a12cb3f7bedb001da6fca"
  },
  {
    "url": "img/icons/msapplication-icon-144x144.png",
    "revision": "b89032a4a5a1879f30ba05a13947f26f"
  },
  {
    "url": "img/icons/mstile-150x150.png",
    "revision": "058a3335d15a3eb84e7ae3707ba09620"
  },
  {
    "url": "img/icons/safari-pinned-tab.svg",
    "revision": "f22d501a35a87d9f21701cb031f6ea17"
  },
  {
    "url": "index.html",
    "revision": "25fb806ae3e92e1b9066926e067e830d"
  },
  {
    "url": "js/app.ea02f241.js",
    "revision": "78a7d51d1eeeb09eec6c8bf1cd0b9b04"
  },
  {
    "url": "js/chunk-vendors.1e3ac55d.js",
    "revision": "87c21f38d975f5a1efa747528ce1c311"
  },
  {
    "url": "js/getThings.3dced796.js",
    "revision": "478111366ae43ba9ac8b69e2a46d5955"
  },
  {
    "url": "js/getThings~makeMoney~newJob.f8c0583c.js",
    "revision": "73d3457242e04c8ba092885d4d62b21d"
  },
  {
    "url": "js/makeMoney.166889b1.js",
    "revision": "cfb6b8cec4dbcd81a9b4978d937e72e4"
  },
  {
    "url": "js/newJob.2b780968.js",
    "revision": "f8d26b3139557d812e2df8f65092ea28"
  },
  {
    "url": "js/you.43fb777e.js",
    "revision": "ebadde78cea5b86140dd40d8e1210210"
  },
  {
    "url": "manifest.json",
    "revision": "48857e926067455922782690e7e1d0eb"
  },
  {
    "url": "robots.txt",
    "revision": "b6216d61c03e6ce0c9aea6ca7808f7ca"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
