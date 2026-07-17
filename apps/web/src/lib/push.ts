import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { API_URL } from "./api";

/**
 * Estrutura de push pronta (FCM via Capacitor) — escopo.md §13.0: "ativação em fase posterior".
 * Só roda dentro do APK (Capacitor.isNativePlatform()); no navegador é um no-op.
 * Sem google-services.json real configurado, o registro simplesmente não dispara — não quebra o app.
 */
export async function initPushNotifications(accessToken: string) {
  if (!Capacitor.isNativePlatform()) return;

  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") return;

  await PushNotifications.register();

  PushNotifications.addListener("registration", async (token) => {
    await fetch(`${API_URL}/client/push-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ token: token.value }),
    }).catch(() => undefined);
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("[push] erro ao registrar", err);
  });
}
