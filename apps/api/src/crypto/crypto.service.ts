import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Criptografia simétrica reversível (AES-256-GCM) para segredos que precisam ser decifrados depois
 * (ex.: access token de gateway de pagamento colado pelo profissional no admin). Diferente do
 * argon2 (hash de senha, one-way), aqui precisamos recuperar o valor original para chamar a API do
 * gateway. Formato de saída: `iv:authTag:ciphertext`, tudo em base64.
 */
@Injectable()
export class CryptoService {
  private get key(): Buffer {
    const raw = process.env.ENCRYPTION_KEY;
    if (!raw) {
      throw new ServiceUnavailableException(
        "ENCRYPTION_KEY não configurada — necessária para salvar/ler credenciais de gateway de pagamento."
      );
    }
    const key = Buffer.from(raw, "base64");
    if (key.length !== 32) {
      throw new ServiceUnavailableException("ENCRYPTION_KEY inválida — precisa ser 32 bytes em base64.");
    }
    return key;
  }

  encrypt(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString("base64"), authTag.toString("base64"), ciphertext.toString("base64")].join(":");
  }

  decrypt(value: string): string {
    const [ivB64, authTagB64, ciphertextB64] = value.split(":");
    const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
    const plain = Buffer.concat([decipher.update(Buffer.from(ciphertextB64, "base64")), decipher.final()]);
    return plain.toString("utf8");
  }
}
