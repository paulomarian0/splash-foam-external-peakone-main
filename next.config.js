/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "www.oriclehearing.com",
      },
      
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
                default-src 'self';
                script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                  *.mxpnl.com
                  *.visualwebsiteoptimizer.com
                  *.googleapis.com
                  *.googletagmanager.com
                  *.google-analytics.com
                  *.4ahjdj2.com
                  *.facebook.net
                  *.yimg.com
                  *.quora.com
                  *.bing.com
                  *.clarity.ms
                  *.ads-twitter.com
                  *.tiktok.com
                  *.pingdom.net
                  *.doubleclick.net
                  *.yimg.com
                  *.nextdoor.com
                  *.liadm.com
                  *.amazonaws.com
                  *.google.com
                  *.vercel.live
                  *.googleadservices.com
                  *.googletagmanager.com
                  *.buysplashcleaner.com
                  *.consumertrustcoalition.com
                  *.fourammedia.com;
                style-src 'self' 'unsafe-inline' *.googletagmanager.com *.googleapis.com;
                img-src 'self' data: https: *.visualwebsiteoptimizer.com;
                font-src 'self' *.gstatic.com;
                frame-src 'self' *.buysplashcleaner.com *.funnelflux.com *.funnelflux.pro;
                connect-src 'self' 
                  *.mixpanel.com
                  *.visualwebsiteoptimizer.com
                  *.googleapis.com
                  *.google-analytics.com
                  *.4ahjdj2.com
                  *.quora.com
                  *.bing.com
                  *.clarity.ms
                  *.ads-twitter.com
                  *.tiktok.com
                  *.doubleclick.net
                  *.google.com
                  *.vercel.live
                  *.facebook.net
                  *.appspot.com
                  *.pingdom.net
                  *.yimg.com
                  *.nextdoor.com
                  *.liadm.com
                  *.googleadservices.com
                  *.googletagmanager.com
                  *.buysplashcleaner.com
                  *.consumertrustcoalition.com
                  *.fourammedia.com;

                worker-src 'self' blob:;
              `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Add other Next.js config options here
};

module.exports = nextConfig;
