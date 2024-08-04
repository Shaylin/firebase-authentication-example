export default async function verifyToken(userIdToken: string): Promise<boolean> {
  const res = await fetch("api/verifyUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIdToken: userIdToken }),
  });
  
  return res.ok;
};