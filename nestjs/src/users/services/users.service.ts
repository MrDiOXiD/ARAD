import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash, compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { SignupDto } from "../dto/signup.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { JwtPayload } from "../../utils/jwt/jwt-payload";
import { AuditService } from "../../audit/audit.services";
import { normalizeError } from "../../utils/errors/normalize-error.util";
import { UserEntity } from "../entities/user.entity";
// Import the Swagger DTO classes (this replaces the old local type)
import { SafeUser, AuthResponse } from "../dto/user-responses.dto";
import { randomBytes, createHash, randomUUID } from 'crypto';
import { RefreshTokenEntity } from "../entities/refresh-token.entity";
import { GoogleProfile } from "./google-auth.service";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days



interface IssuedSession {
  accessToken: string;
  refreshToken: string; // raw value — controller puts this in the cookie, NEVER in the JSON body
  user: SafeUser;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  // ── Register ──────────────────────────────────────────────────────────────

  async signup(body: SignupDto): Promise<SafeUser> {
    // 1. Normalize the phone number so +989..., 00989..., and 09... are all saved identically
    const normalizedPhone = body.phoneNumber.replace(/^(?:\+98|0098)/, "0");

    // 2. Check if the phone number is already registered
    const existingPhone = await this.findUserByPhoneNumber(normalizedPhone);
    if (existingPhone) throw new ConflictException("Phone number already in use");

    // 3. Check email ONLY if the user decided to provide one
    if (body.email) {
      const existingEmail = await this.findUserByEmail(body.email);
      if (existingEmail) throw new ConflictException("Email already in use");
    }

    // 4. Fixed: username was never checked, so a duplicate username fell
    // through to the DB's unique constraint and surfaced as an
    // unhandled 500 instead of a clean 409.
    const existingUsername = await this.findUserByUsername(body.username);
    if (existingUsername) throw new ConflictException("Username already in use");

    // 5. Hash password and create user
    const hashed = await this.hashPassword(body.password);
    const newUser = this.userRepository.create({
      ...body,
      phoneNumber: normalizedPhone, // Save the cleaned up number
      password: hashed,
    });

    let saved: UserEntity;
    try {
      saved = await this.userRepository.save(newUser);
    } catch (error) {
      // Defense-in-depth: the checks above have a TOCTOU race (two
      // concurrent signups can both pass step 2/3/4 before either write
      // lands), and this also catches any uniqueness constraint we
      // simply forgot to check by hand. Postgres unique_violation is
      // error code 23505 — anything else is a genuine unexpected error
      // and should keep propagating as a 500 with its real cause intact.
      if ((error as { code?: string }).code === "23505") {
        throw new ConflictException(
          "A user with this email, username, or phone number already exists.",
        );
      }
      throw error;
    }

    // Return explicit shape matching the SafeUser class
    return {
      id: saved.id,
      phoneNumber: saved.phoneNumber,
      email: saved.email,
      username: saved.username,
      roles: saved.roles,
      createdAt: saved.createdAt,
    };
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  async findUserByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

async signIn(body: LoginUserDto, clientIp: string): Promise<IssuedSession> {
  const { phoneNumber, password } = body;
  const user = await this.findUserByPhoneNumber(phoneNumber);

  // Single vague message — never reveal whether the phone number or
  // password was wrong; that distinction is exactly what lets an
  // attacker enumerate registered phone numbers.
  const authError = new UnauthorizedException('Invalid credentials');
  if (!user) throw authError;
  if (!(await this.comparePassword(password, user.password))) throw authError;

  const session = await this.issueSession(user, clientIp);

  try {
    this.auditService.logUserLogin(user.id, clientIp);
  } catch (error) {
    const err = normalizeError(error);
    this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
  }

  return session;
}


async issueSession(user: UserEntity, clientIp: string): Promise<IssuedSession> {
  const secret = this.configService.get<string>('JWT_SECRET');
  if (!secret) throw new InternalServerErrorException('Auth misconfiguration');

  const payload: JwtPayload = {
    username: user.username,
    email: user.email,
    id: user.id,
    role: user.roles,
  };

  let accessToken: string;
  try {
    accessToken = this.jwtService.sign(payload, { secret, expiresIn: ACCESS_TOKEN_TTL });
  } catch (error) {
    const err = normalizeError(error);
    this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
    throw new InternalServerErrorException('Could not issue token');
  }

  const refreshToken = await this.createRefreshToken(user, randomUUID(), clientIp);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      phoneNumber: user.phoneNumber,
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
    },
  };
}

/** Generates a raw refresh token, persists only its hash, returns the raw value for the cookie. */
private async createRefreshToken(
  user: UserEntity,
  familyId: string,
  clientIp: string,
): Promise<string> {
  const raw = randomBytes(40).toString('hex');
  const tokenHash = this.hashToken(raw);

  await this.refreshTokenRepository.save(
    this.refreshTokenRepository.create({
      tokenHash,
      familyId,
      user,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      createdByIp: clientIp,
    }),
  );

  return raw;
}

private hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}


async refreshAccessToken(rawToken: string, clientIp: string): Promise<IssuedSession> {
  const tokenHash = this.hashToken(rawToken);
  const stored = await this.refreshTokenRepository.findOne({
    where: { tokenHash },
    relations: ['user'],
  });

  if (!stored) throw new UnauthorizedException('Invalid refresh token');

  if (stored.revoked) {
    await this.refreshTokenRepository.update(
      { familyId: stored.familyId },
      { revoked: true },
    );
    throw new UnauthorizedException(
      'Refresh token reuse detected — all sessions for this login have been revoked.',
    );
  }

  if (stored.expiresAt.getTime() < Date.now()) {
    throw new UnauthorizedException('Refresh token expired');
  }

  stored.revoked = true;
  await this.refreshTokenRepository.save(stored);

  return this.issueRotatedSession(stored.user, stored.familyId, clientIp);
}

private async issueRotatedSession(
  user: UserEntity,
  familyId: string,
  clientIp: string,
): Promise<IssuedSession> {
  const secret = this.configService.get<string>('JWT_SECRET');
  if (!secret) throw new InternalServerErrorException('Auth misconfiguration');

  const payload: JwtPayload = {
    username: user.username,
    email: user.email,
    id: user.id,
    role: user.roles,
  };
  const accessToken = this.jwtService.sign(payload, { secret, expiresIn: ACCESS_TOKEN_TTL });
  const refreshToken = await this.createRefreshToken(user, familyId, clientIp);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      phoneNumber: user.phoneNumber,
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
    },
  };
}

async logout(rawToken: string): Promise<void> {
  const tokenHash = this.hashToken(rawToken);
  const stored = await this.refreshTokenRepository.findOne({ where: { tokenHash } });
  if (!stored) return; // already invalid/expired — logout is idempotent, not an error
  await this.refreshTokenRepository.update({ familyId: stored.familyId }, { revoked: true });
}


  // ── Queries ───────────────────────────────────────────────────────────────

  async findAllUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber, // 👈 ADD THIS LINE
      username: user.username,
      roles: user.roles,
      createdAt: user.createdAt,
    }));
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ── Helpers (private) ─────────────────────────────────────────────────────

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 12); // 12 rounds — OWASP minimum for bcrypt
  }

  private async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
  /**
   * Loads a user together with their orders (each order's line items +
   * the referenced product), and their reviews (with the reviewed
   * product). One round trip via left joins instead of N+1 lazy loads.
   *
   * SECURITY: only ever call this with the requesting user's own id
   * (from @CurrentUser(), never from a client-supplied :id param) unless
   * the caller is an admin — this returns order history, which is
   * private data.
   */
  async getFullProfile(userId: number): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.orders", "orders")
      .leftJoinAndSelect("orders.products", "orderProducts")
      .leftJoinAndSelect("orderProducts.product", "product")
      .leftJoinAndSelect("orders.shippingAddress", "shippingAddress")
      .leftJoinAndSelect("user.reviews", "reviews")
      .leftJoinAndSelect("reviews.product", "reviewProduct")
      .where("user.id = :userId", { userId })
      .orderBy("orders.orderAt", "DESC")
      .getOne();
  }

  /**
   * Finds the user matching this Google account, linking or creating as
   * needed. Call this only with an ALREADY-VERIFIED GoogleProfile (i.e.
   * only from GoogleAuthService.verify()'s output) — this method trusts
   * profile.email as proof of ownership, which is only safe once Google
   * has confirmed it server-side.
   */
  async findOrCreateFromGoogle(profile: GoogleProfile): Promise<UserEntity> {
    // 1. Already linked — the common case for a returning user.
    const byGoogleId = await this.userRepository.findOne({
      where: { googleId: profile.googleId },
    });
    if (byGoogleId) return byGoogleId;

    // 2. An account with this email already exists (e.g. they originally
    // signed up with password auth) — link this Google identity to it
    // rather than creating a duplicate account. Safe specifically
    // because profile.email came from GoogleAuthService.verify(), which
    // already enforced email_verified === true.
    const byEmail = await this.findUserByEmail(profile.email);
    if (byEmail) {
      byEmail.googleId = profile.googleId;
      return this.userRepository.save(byEmail);
    }

    // 3. Brand new user. Derive a username candidate from the email
    // local-part, sanitized to fit your existing username rules
    // (alphanumeric + underscore, 4-20 chars), then disambiguate against
    // collisions.
    const localPart = profile.email
      .split("@")[0]
      .replace(/[^a-zA-Z0-9_]/g, "")
      .slice(0, 15);
    const baseUsername = localPart.length >= 4 ? localPart : `user_${localPart}`;

    let username = baseUsername;
    let suffix = 0;
    // Bounded retry, not an unbounded loop — five attempts is already
    // extremely unlikely to collide, and an unbounded loop on user input
    // (indirectly, via email) is its own minor DoS surface.
    while ((await this.findUserByUsername(username)) && suffix < 5) {
      suffix += 1;
      username = `${baseUsername}${randomBytes(2).toString("hex")}`;
    }
    if (await this.findUserByUsername(username)) {
      throw new ConflictException("Could not allocate a username — please try again.");
    }

    // Google-authenticated users don't set a password through us. Store
    // a random, never-disclosed, never-usable hash rather than making
    // the column nullable — this keeps every other query/constraint that
    // assumes a password exists unchanged, and if they later want
    // password login too they'd go through a normal "set password" /
    // reset flow, which naturally overwrites this.
    const unusablePassword = await this.hashPassword(randomBytes(32).toString("hex"));

    const newUser = this.userRepository.create({
      email: profile.email,
      username,
      googleId: profile.googleId,
      password: unusablePassword,
      phoneNumber: undefined, // nullable — see the AddGoogleAuthToUser migration
    });

    return this.userRepository.save(newUser);
  }
}
