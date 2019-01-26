// flow-typed signature: c3559ef4086d902f78a755aed8581e48
// flow-typed version: f306435c54/bcrypt_v3.x.x/flow_>=v0.25.x

declare module bcrypt {
  declare function genSaltSync(rounds?: number): string;
  declare function genSalt(rounds: number): Promise<string>;
  declare function genSalt(): Promise<string>;
  declare function genSalt(callback: (err: Error, salt: string) => void): void;
  declare function genSalt(
    rounds: number,
    callback: (err: Error, salt: string) => void
  ): void;
  declare function hashSync(data: string, salt: string): string;
  declare function hashSync(data: string, rounds: number): string;
  declare function hash(
    data: string,
    saltOrRounds: string | number
  ): Promise<string>;
  declare function hash(
    data: string,
    rounds: number,
    callback: (err: Error, encrypted: string) => void
  ): void;
  declare function hash(
    data: string,
    salt: string,
    callback: (err: Error, encrypted: string) => void
  ): void;
  declare function compareSync(data: string, encrypted: string): boolean;
  declare function compare(data: string, encrypted: string): Promise<boolean>;
  declare function compare(
    data: string,
    encrypted: string,
    callback: (err: Error, same: boolean) => void
  ): void;
  declare function getRounds(encrypted: string): number;
}
