module.exports = function gtmPlugin(context, options) {
  const { siteConfig } = context;
  // Check both NODE_ENV and Docusaurus deployment environment
  const isProd = process.env.NODE_ENV === 'production' && 
                 process.env.DEPLOYMENT_BRANCH !== 'preview' &&
                 process.env.CONTEXT !== 'deploy-preview';
  
  // Also allow explicit disabling via environment variable
  const gtmDisabled = process.env.DISABLE_GTM === 'true';
  
  return {
    name: 'docusaurus-plugin-gtm-production-only',
    
    injectHtmlTags() {
      // Only inject GTM tags in production and when not explicitly disabled
      if (!isProd || gtmDisabled) {
        console.log('[GTM Plugin] Skipping GTM injection - isProd:', isProd, 'gtmDisabled:', gtmDisabled);
        return {};
      }
      
      const gtmId = options.gtmId || 'GTM-MQ6GKFL8';
      console.log('[GTM Plugin] Injecting GTM with ID:', gtmId);
      
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          },
        ],
        postBodyTags: [
          {
            tagName: 'noscript',
            innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          },
        ],
      };
    },
  };
};