class TokenValidation {
  static createExpiresIn(): number {
    const expiresIn = Date.now() + 4 * 60 * 60 * 1000;

    return expiresIn;
  }

  static isTokenExpired(exspireIn: number): boolean {
    const currentTime = Date.now();

    return currentTime > exspireIn;
  }
}

export { TokenValidation };
