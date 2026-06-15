// Cloudflare Pages middleware: enforce a single canonical host.
// 301-redirect the www subdomain to the apex so search engines consolidate
// duplicate indexing. This runs at the edge on every request and CAN read the
// hostname — unlike _redirects, whose source matches the path only.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4); // drop "www."
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
