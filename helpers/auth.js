import { rejects } from "assert";
import { randomBytes, pbkdf2 } from "crypto";
import { resolve } from "path";

export const hashPassword = (password) => {
    return new promise((resolve, reject) => {
        const salt = randomBytes(16).toString("hex");
        //pbkdf2 is a algorithm with 1000 iterations, 64 length and sha512 digest hashing
        pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
};

export const comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hashed.split(":");
        pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
            if (err) reject(err);
            resolve(key === derivedKey.toString("hex"));
        });
    });
};