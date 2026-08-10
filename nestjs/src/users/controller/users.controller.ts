import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  NotFoundException,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from "@nestjs/swagger";

import { SignupDto } from "../dto/signup.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { UserService } from "../services/users.service";
import { SafeUser, AuthResponse } from "../dto/user-responses.dto";
import { Public } from "../../utils/decorators/authPublic.decorators";
import { AuthenticationGuard } from "../../utils/guard/auth.guard";
import { AuthorizedGuard } from "../../utils/guard/authorized-role.guard";
import { Roles } from "../../utils/common/Roles.enum";
import { extractClientIp } from "../../utils/http/extract-client-ip.util";
import { CurrentUser } from "@/utils/decorators/currentUser.decorator";
import { UserEntity } from "../entities/user.entity";
import { GoogleAuthDto } from "../dto/google-auth.dto";
import { GoogleAuthService } from "../services/google-auth.service";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_PATH = '/'; // was '/user' — broke once the /api rewrite prefix entered the picture
function setRefreshCookie(res: ExpressResponse, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: REFRESH_COOKIE_PATH,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

@ApiTags("User Management")
@ApiConsumes("application/json")
@ApiProduces("application/json")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register a new user account" })
  @ApiBody({
    type: SignupDto,
    description: "User registration details including email, username, and secure password.",
  })
  @ApiCreatedResponse({ description: "The user has been successfully created.", type: SafeUser })
  @ApiBadRequestResponse({
    description:
      "Validation failed (e.g., weak password, username too short, invalid email format).",
  })
  @ApiConflictResponse({
    description: "Conflict. A user with this email or username already exists.",
  })
  async register(@Body() body: SignupDto): Promise<SafeUser> {
    return this.userService.signup(body);
  }

  // ── Replace your existing POST /login handler with this ────────────────
  @Post("login")
  @Public() // adjust to whatever your existing decorator for "no auth required" is
  @ApiOperation({ summary: "Log in with phone number and password" })
  @ApiResponse({ status: 200, description: "Logged in successfully." })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  async login(
    @Body() body: LoginUserDto,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const clientIp = extractClientIp(req);
    const { accessToken, refreshToken, user } = await this.userService.signIn(body, clientIp);

    setRefreshCookie(res, refreshToken);

    // Refresh token NEVER goes in the JSON body — cookie only.
    return { accessToken, user };
  }

  // ── New endpoint ─────────────────────────────────────────────────────────
  @Post("refresh")
  @Public()
  @ApiOperation({ summary: "Exchange the refresh cookie for a new access token" })
  @ApiResponse({ status: 200, description: "New access token issued." })
  @ApiResponse({ status: 401, description: "Missing, invalid, or reused refresh token." })
  async refresh(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!rawToken) throw new UnauthorizedException("No refresh token provided");

    const clientIp = extractClientIp(req);

    try {
      const { accessToken, refreshToken, user } = await this.userService.refreshAccessToken(
        rawToken,
        clientIp,
      );
      setRefreshCookie(res, refreshToken);
      return { accessToken, user };
    } catch (error) {
      // Whatever went wrong (expired, reused, invalid) — the client no
      // longer has a usable session, so clear the stale cookie too.
      res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
      throw error;
    }
  }

  // ── New endpoint ─────────────────────────────────────────────────────────
  @Post("logout")
  @Public()
  @ApiOperation({ summary: "Log out — revokes the current refresh token" })
  @ApiResponse({ status: 200, description: "Logged out." })
  async logout(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (rawToken) {
      await this.userService.logout(rawToken);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get()
  @ApiOperation({
    summary: "Retrieve all users",
    description: "Requires an active JWT token and ADMIN role.",
  })
  @ApiOkResponse({ description: "Successfully retrieved the list of users.", type: [SafeUser] })
  @ApiUnauthorizedResponse({
    description: "Unauthorized. JWT token is missing, expired, or invalid.",
  })
  @ApiForbiddenResponse({
    description: "Forbidden. The authenticated user does not have ADMIN privileges.",
  })
  async findAllUsers(): Promise<SafeUser[]> {
    return this.userService.findAllUsers();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get(":id(\\d+)")   // was @Get(":id") — the (\d+) constraint means this
                       // route can ONLY match numeric ids (e.g. /user/21),
                       // never a literal word like /user/wishlist, no
                       // matter what order controllers/modules load in.
  @ApiOperation({
    summary: "Retrieve a specific user by ID",
    description: "Requires an active JWT token and ADMIN role.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    description: "The unique numeric identifier of the user",
    example: 1,
  })
  @ApiOkResponse({ description: "Successfully retrieved the user.", type: SafeUser })
  @ApiUnauthorizedResponse({
    description: "Unauthorized. JWT token is missing, expired, or invalid.",
  })
  @ApiForbiddenResponse({
    description: "Forbidden. The authenticated user does not have ADMIN privileges.",
  })
  @ApiNotFoundResponse({ description: "Not Found. No user exists with the provided ID." })
  async findUser(@Param("id", ParseIntPipe) id: number): Promise<SafeUser> {
    const user = await this.userService.findUserById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    const { password: _omit, ...safe } = user;
    return safe as SafeUser;
  }
 
  // Add this to UsersController. Requires ClassSerializerInterceptor to
  // be active (globally in main.ts, or add
  // @UseInterceptors(ClassSerializerInterceptor) here) so
  // UserEntity.password stays stripped by its @Exclude() decorator.

  @Get("me/full")
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get the current user's profile with orders and reviews",
    description:
      "Returns the authenticated user together with their order history " +
      "(including line items and shipping address per order) and their " +
      "product reviews, in a single response.",
  })
  @ApiOkResponse({ description: "Successfully retrieved full profile." })
  @ApiResponse({ status: 401, description: "Unauthorized. Token missing or invalid." })
  async getMyFullProfile(@CurrentUser() currentUser: UserEntity) {
    // Re-fetch rather than trusting whatever @CurrentUser() decoded from
    // the JWT — the token payload is minimal (id/roles), not the full
    // relation graph, and using currentUser.id here (not any client
    // input) is what keeps this endpoint from being an IDOR risk.
    const profile = await this.userService.getFullProfile(currentUser.id);
    if (!profile) {
      throw new NotFoundException("User not found.");
    }
    return profile;
  }
  // Add to UserController, alongside your existing register/login routes.
  // Uses the same rate limiting your other auth routes already have
  // (brute-forcing idToken isn't feasible, but this endpoint still does
  // a DB write on new-user creation, so it shouldn't be exempt from
  // whatever throttling you apply to /user/register).

  @Post("google")
  @Public()
  @ApiOperation({ summary: "Sign in or sign up with a Google account" })
  @ApiResponse({ status: 200, description: "Signed in successfully." })
  @ApiResponse({ status: 401, description: "Invalid or unverified Google token." })
  async googleAuth(
    @Body() dto: GoogleAuthDto,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const clientIp = extractClientIp(req);
    const profile = await this.googleAuthService.verify(dto.idToken);
    const user = await this.userService.findOrCreateFromGoogle(profile);

    // Same session issuance as password login — a Google sign-in
    // produces an identical access token + rotating refresh cookie, so
    // the rest of the app never needs to know which method was used.
    const {
      accessToken,
      refreshToken,
      user: safeUser,
    } = await this.userService.issueSession(user, clientIp);

    setRefreshCookie(res, refreshToken); // reuse the same helper from login()/refresh()

    return { accessToken, user: safeUser };
  }
}
