import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string | undefined;
  picture: string | undefined;
}

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID is not set in the environment.');
    }
    this.client = new OAuth2Client(clientId);
  }

  /**
   * Verifies the ID token's signature, expiry, issuer, and — critically —
   * that its `aud` claim matches OUR client id (verifyIdToken's
   * `audience` option does this). Without the audience check, a token
   * minted for a completely different app could be replayed here.
   */
  async verify(idToken: string): Promise<GoogleProfile> {
    let ticket;
    try {
      ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch {
      throw new UnauthorizedException('Invalid Google token.');
    }

    const payload: TokenPayload | undefined = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token.');
    }

    if (!payload.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified.');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }
}
