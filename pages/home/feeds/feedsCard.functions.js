export function getSubdomainFromUser(user) {
  const { subdomain } = user;

  const protocol = process.env.REACT_APP_LINK_PROTOCOL;
  const host = process.env.REACT_APP_LINK_HOST;

  const link = `${protocol}${subdomain}.${host}`;
  console.log("link", link);
  return link;
}
