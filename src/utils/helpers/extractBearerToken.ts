export function extractBearerToken(token: string) {
  return token.replace("Bearer ", "") as string;
}
