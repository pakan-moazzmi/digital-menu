export class ValidationError extends Error {}

export function requireNonEmpty(value: string | null | undefined, fieldLabel: string): string {
  const trimmed = (value ?? "").trim();
  if (trimmed.length === 0) {
    throw new ValidationError(`${fieldLabel} نمی‌تواند خالی باشد`);
  }
  return trimmed;
}

export function requireMaxLength(value: string, max: number, fieldLabel: string): string {
  if (value.length > max) {
    throw new ValidationError(`${fieldLabel} نباید بیشتر از ${max} کاراکتر باشد`);
  }
  return value;
}

export function requirePositiveNumber(value: string | null, fieldLabel: string): number {
  const num = Number(value);
  if (value === null || value === "" || isNaN(num) || num < 0) {
    throw new ValidationError(`${fieldLabel} باید عددی معتبر و غیرمنفی باشد`);
  }
  return num;
}

export function requireValidSlug(value: string | null): string {
  const slug = (value ?? "").trim().toLowerCase();
  const SLUG_REGEX = /^[a-z0-9-]+$/;
  if (!SLUG_REGEX.test(slug)) {
    throw new ValidationError(
      "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"
    );
  }
  if (slug.length < 3) {
    throw new ValidationError("اسلاگ باید حداقل ۳ کاراکتر باشد");
  }
  return slug;
}

export function requireValidEmail(value: string | null): string {
  const email = (value ?? "").trim();
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError("ایمیل معتبر وارد کنید");
  }
  return email;
}

export function requireMinLength(value: string, min: number, fieldLabel: string): string {
  if (value.length < min) {
    throw new ValidationError(`${fieldLabel} باید حداقل ${min} کاراکتر باشد`);
  }
  return value;
}