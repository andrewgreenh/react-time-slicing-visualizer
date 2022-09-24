export function syncSleep(ms: number) {
  if (typeof window === "undefined") return;
  const req = new XMLHttpRequest();

  req.open("GET", `/api/sleep/${ms}`, false);
  req.send();
}
