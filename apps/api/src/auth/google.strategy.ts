import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      // Placeholders não vazios: evitam crash do passport-oauth2 quando as chaves reais
      // ainda não foram configuradas (escopo.md §13.0 — não bloquear por falta de chave real).
      // Sem credenciais reais, o redirect ao Google simplesmente falha no lado do Google.
      clientID: process.env.GOOGLE_CLIENT_ID || "not-configured",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "not-configured",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "https://api.localhost/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName } = profile;
    done(null, { googleId: id, email: emails?.[0]?.value, name: displayName });
  }
}
